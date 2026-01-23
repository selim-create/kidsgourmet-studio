import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '@/lib/constants';
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

// Yardımcı: Eksik görselleri tamamla
const hydrateWithImages = async (posts: WpPost[]): Promise<WpPost[]> => {
  return Promise.all(posts.map(async (post) => {
    const embeddedMedia = post._embedded?.['wp:featuredmedia'];
    const isMediaCorrupted = embeddedMedia && embeddedMedia[0] && (embeddedMedia[0].code || !embeddedMedia[0].source_url);
    const hasValidMedia = embeddedMedia && embeddedMedia[0] && embeddedMedia[0].source_url;

    if (hasValidMedia) return post;

    if (post.featured_media && post.featured_media > 0) {
      const media = await getMediaById(post.featured_media);
      if (media && media.source_url) {
        return {
          ...post,
          _embedded: {
            ...post._embedded,
            'wp:featuredmedia': [media]
          }
        };
      }
    }
    
    if (isMediaCorrupted) {
        const cleanedPost = { ...post };
        if (cleanedPost._embedded) {
             cleanedPost._embedded = {
                 ...cleanedPost._embedded,
                 'wp:featuredmedia': []
             };
        }
        return cleanedPost;
    }
    return post;
  }));
};

// 1. İçerik Arama (GÜNCELLENDİ: ingredients eklendi, wp:term eklendi)
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

  const url = `${API_BASE_URL}${endpoint}?search=${query}&_embed&per_page=10`;

  try {
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`API Hatası: ${res.status}`);
    
    let data = await res.json();
    data = await hydrateWithImages(data);
    
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
    if (url.includes('/tarifler/') || url.includes('/recipes/')) {
      endpoint = API_ENDPOINTS.RECIPES_BY_SLUG(slug);
    } else if (url.includes('/malzemeler/') || url.includes('/ingredients/')) {
      endpoint = API_ENDPOINTS.INGREDIENTS_BY_SLUG(slug);
    } else {
      endpoint = API_ENDPOINTS.POSTS_BY_SLUG(slug);
    }
    
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers: getHeaders() });
    if (!res.ok) return null;
    
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const posts = await hydrateWithImages([data[0]]);
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
    const posts = await hydrateWithImages([data]);
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
  return '/assets/kg-logo.png';
};