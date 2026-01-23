import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS, DEFAULTS, WP_API_NAMESPACE } from '@/lib/constants';
import { WpPost } from '@/types';

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Yardımcı: Medya bilgisini ID ile çek
const getMediaById = async (mediaId: number) => {
  if (!mediaId) return null;
  const url = `${API_BASE_URL}/wp/v2/media/${mediaId}`;
  
  try {
    let res = await fetch(url, { headers: getHeaders() });
    
    // Yetki hatası (401/403) varsa anonim dene
    if ((res.status === 401 || res.status === 403) && localStorage.getItem(STORAGE_KEYS.TOKEN)) {
       res = await fetch(url);
    }

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Media fetch error:', error);
    return null;
  }
};

// Yardımcı: Yazar bilgisini ID ile çek
const getAuthorById = async (authorId: number) => {
  if (!authorId) return null;
  const url = `${API_BASE_URL}/wp/v2/users/${authorId}`;
  
  try {
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Author fetch error:', error);
    return null;
  }
};

// Yardımcı: Taxonomy term'lerini çek
const getTermsByPostId = async (postId: number, postType: string) => {
  const taxonomies: Record<string, string[]> = {
    recipes: ['age-group', 'meal-type', 'category'],
    ingredients: ['season', 'category'],
    posts: ['category'],
  };
  
  const postTaxonomies = taxonomies[postType] || taxonomies['posts'];
  const allTerms: Array<{id: number; name: string; slug: string; taxonomy: string; meta?: {color_code?: string}}> = [];
  
  for (const taxonomy of postTaxonomies) {
    try {
      const url = `${API_BASE_URL}/wp/v2/${taxonomy}?post=${postId}`;
      const res = await fetch(url, { headers: getHeaders() });
      if (res.ok) {
        const terms = await res.json();
        allTerms.push(...terms.map((t: {id: number; name: string; slug: string; meta?: {color_code?: string}}) => ({ ...t, taxonomy })));
      }
    } catch (error) {
      console.error(`Taxonomy fetch error for ${taxonomy}:`, error);
    }
  }
  
  return allTerms;
};

// Yardımcı: Eksik verileri tamamla (görseller, yazar, taxonomy'ler)
const hydratePostData = async (posts: WpPost[]): Promise<WpPost[]> => {
  return Promise.all(posts.map(async (post) => {
    let updatedPost = { ...post };
    
    // 1. Görselleri tamamla
    const embeddedMedia = post._embedded?.['wp:featuredmedia'];
    const isMediaCorrupted = embeddedMedia && embeddedMedia[0] && (embeddedMedia[0].code || !embeddedMedia[0].source_url);
    const hasValidMedia = embeddedMedia && embeddedMedia[0] && embeddedMedia[0].source_url;

    if (!hasValidMedia && post.featured_media && post.featured_media > 0) {
      const media = await getMediaById(post.featured_media);
      if (media && media.source_url) {
        updatedPost = {
          ...updatedPost,
          _embedded: {
            ...updatedPost._embedded,
            'wp:featuredmedia': [media]
          }
        };
      }
    }
    
    if (isMediaCorrupted) {
      updatedPost = {
        ...updatedPost,
        _embedded: {
          ...updatedPost._embedded,
          'wp:featuredmedia': []
        }
      };
    }

    // 2. Yazar bilgisini tamamla
    const hasAuthor = post._embedded?.author && post._embedded.author.length > 0;
    if (!hasAuthor && post.author) {
      const author = await getAuthorById(post.author);
      if (author) {
        updatedPost = {
          ...updatedPost,
          _embedded: {
            ...updatedPost._embedded,
            author: [author]
          }
        };
      }
    }

    // 3. Taxonomy term'lerini tamamla
    const hasTerms = post._embedded?.['wp:term'] && post._embedded['wp:term'].length > 0;
    if (!hasTerms && post.id && post.type) {
      const terms = await getTermsByPostId(post.id, post.type);
      if (terms.length > 0) {
        // Taxonomy'lere göre grupla
        const groupedTerms: Record<string, Array<{id: number; name: string; slug: string; taxonomy: string; meta?: {color_code?: string}}>> = {};
        terms.forEach(term => {
          if (!groupedTerms[term.taxonomy]) {
            groupedTerms[term.taxonomy] = [];
          }
          groupedTerms[term.taxonomy].push(term);
        });
        
        // wp:term formatında düzenle
        const termArrays = Object.values(groupedTerms);
        updatedPost = {
          ...updatedPost,
          _embedded: {
            ...updatedPost._embedded,
            'wp:term': termArrays
          }
        };
      }
    }

    return updatedPost;
  }));
};

// 1. İçerik Arama (GÜNCELLENDİ: _embed parametresi düzeltildi, encoding eklendi)
export const searchContent = async (
  query: string, 
  type: 'recipes' | 'posts' | 'ingredients' | 'all' = 'recipes'
): Promise<WpPost[]> => {
  // 'all' tipi için tüm endpoint'lere paralel istek at
  if (type === 'all') {
    const [recipes, posts, ingredients] = await Promise.all([
      searchContent(query, 'recipes'),
      searchContent(query, 'posts'),
      searchContent(query, 'ingredients')
    ]);
    return [...recipes, ...posts, ...ingredients];
  }
  
  let endpoint = API_ENDPOINTS.RECIPES;
  
  if (type === 'posts') endpoint = API_ENDPOINTS.POSTS;
  if (type === 'ingredients') endpoint = API_ENDPOINTS.INGREDIENTS;

  const url = `${API_BASE_URL}${endpoint}?search=${encodeURIComponent(query)}&_embed&per_page=10`;

  try {
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`API Hatası: ${res.status}`);
    
    let data = await res.json();
    data = await hydratePostData(data);
    
    return data;
  } catch (error) {
    console.error('Search Error:', error);
    return [];
  }
};

// 2. Login
export const loginUser = async (username: string, password: string) => {
  const url = `${API_BASE_URL}${API_ENDPOINTS.AUTH_LOGIN}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password: password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Giriş başarısız (${res.status})`);
    }
    
    const data = await res.json();
    const token = data.token || data.data?.token;
    
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      const displayName = data.user_display_name || data.user_nicename || username;
      localStorage.setItem(STORAGE_KEYS.USER, displayName);
    }
    return data;
  } catch (error) {
    console.error('Login Fonksiyon Hatası:', error);
    throw error;
  }
};

// 3. Post'u URL ile çek
export const getPostByUrl = async (url: string): Promise<WpPost | null> => {
  try {
    // URL'den slug çıkar
    // Örnek: https://kidsgourmet.com.tr/tarifler/avokadolu-pure -> avokadolu-pure
    const urlParts = url.split('/').filter(Boolean);
    const slug = urlParts[urlParts.length - 1];
    
    // Post type'ı belirle (tarifler, malzemeler, vb.)
    let endpoint = '';
    let postType = 'posts';
    
    if (url.includes('/tarifler/') || url.includes('/recipes/')) {
      endpoint = API_ENDPOINTS.RECIPES_BY_SLUG(slug);
      postType = 'recipes';
    } else if (url.includes('/malzemeler/') || url.includes('/ingredients/')) {
      endpoint = API_ENDPOINTS.INGREDIENTS_BY_SLUG(slug);
      postType = 'ingredients';
    } else {
      endpoint = API_ENDPOINTS.POSTS_BY_SLUG(slug);
      postType = 'posts';
    }
    
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers: getHeaders() });
    if (!res.ok) return null;
    
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      // Post type bilgisini ekle
      const postWithType = { ...data[0], type: postType };
      const posts = await hydratePostData([postWithType]);
      return posts[0];
    }
    return null;
  } catch (error) {
    console.error('Get Post By URL Error:', error);
    return null;
  }
};

// 4. Post'u ID ile çek
export const getPostById = async (
  id: number, 
  type: 'recipes' | 'posts' | 'ingredients'
): Promise<WpPost | null> => {
  try {
    let endpoint = '';
    if (type === 'recipes') endpoint = API_ENDPOINTS.RECIPES_BY_ID(id);
    else if (type === 'ingredients') endpoint = API_ENDPOINTS.INGREDIENTS_BY_ID(id);
    else endpoint = API_ENDPOINTS.POSTS_BY_ID(id);
    
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers: getHeaders() });
    if (!res.ok) return null;
    
    const data = await res.json();
    // Post type bilgisini ekle
    const postWithType = { ...data, type };
    const posts = await hydratePostData([postWithType]);
    return posts[0];
  } catch (error) {
    console.error('Get Post By ID Error:', error);
    return null;
  }
};

// 5. Varsayılan watermark'ı al
export const getDefaultWatermark = async (): Promise<string> => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SITE_OPTIONS}`, { 
      headers: getHeaders() 
    });
    
    if (res.ok) {
      const data = await res.json();
      // kg_email_logo'yu çek
      if (data.kg_email_logo) {
        return data.kg_email_logo;
      }
    }
  } catch (error) {
    console.error('Get Default Watermark Error:', error);
  }
  
  // Fallback
  return DEFAULTS.WATERMARK_URL;
};

// 6. Media library'den watermark seçenekleri çek
export const getWatermarkOptions = async (): Promise<Array<{id: number; url: string; title: string}>> => {
  try {
    // Logo tag'li medyaları çek
    const url = `${API_BASE_URL}${WP_API_NAMESPACE}/media?search=logo&per_page=10`;
    const res = await fetch(url, { headers: getHeaders() });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    
    return data.map((item: {
      id: number;
      source_url: string;
      title?: { rendered?: string };
    }) => ({
      id: item.id,
      url: item.source_url,
      title: item.title?.rendered || 'Logo',
    }));
  } catch (error) {
    console.error('getWatermarkOptions error:', error);
    return [];
  }
};