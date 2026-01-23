import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS, DEFAULTS, WP_API_NAMESPACE } from '@/lib/constants';
import { WpPost, KgRecipeResponse, KgIngredientResponse } from '@/types';

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

// Type definition for taxonomy terms
type TaxonomyTerm = {
  id: number;
  name: string;
  slug: string;
  taxonomy?: string;
  meta?: {
    color_code?: string;
  };
};

// Helper: Convert KG Recipe Response to WpPost format
const mapKgRecipeToWpPost = (recipe: KgRecipeResponse): WpPost => {
  return {
    id: recipe.id,
    date: new Date().toISOString(),
    slug: recipe.slug,
    type: 'recipes',
    author: recipe.author.id,
    title: { rendered: recipe.title },
    content: { rendered: '' },
    excerpt: { rendered: recipe.excerpt },
    featured_media: 0,
    _embedded: {
      'wp:featuredmedia': recipe.image ? [{ source_url: recipe.image }] : [],
      'author': recipe.author ? [{
        name: recipe.author.name,
        avatar_urls: { '96': recipe.author.avatar, '48': recipe.author.avatar },
        id: recipe.author.id,
        slug: recipe.author.slug,
      }] : [],
      'wp:term': [
        recipe.age_group ? [{
          id: 0,
          name: recipe.age_group,
          slug: recipe.age_group.toLowerCase(),
          taxonomy: 'age-group',
          meta: { color_code: recipe.age_group_color }
        }] : [],
        recipe.meal_type ? [{
          id: 0,
          name: recipe.meal_type,
          slug: recipe.meal_type.toLowerCase(),
          taxonomy: 'meal-type'
        }] : []
      ].filter(arr => arr.length > 0)
    },
    acf: {
      ingredients: recipe.ingredients,
      preparation_time: recipe.prep_time,
      expert_name: recipe.expert?.name,
      expert_title: recipe.expert?.title,
      expert_avatar: recipe.expert?.image,
      expert_note: recipe.expert?.note,
      is_expert_verified: recipe.expert?.approved,
      allergens: recipe.allergens,
    }
  };
};

// Helper: Convert KG Ingredient Response to WpPost format
const mapKgIngredientToWpPost = (ingredient: KgIngredientResponse): WpPost => {
  // Join season array to string, or use first element
  const seasonStr = Array.isArray(ingredient.season) 
    ? ingredient.season[0] || '' 
    : ingredient.season || '';

  return {
    id: ingredient.id,
    date: new Date().toISOString(),
    slug: ingredient.slug,
    type: 'ingredients',
    title: { rendered: ingredient.name },
    content: { rendered: ingredient.description },
    excerpt: { rendered: ingredient.description },
    featured_media: 0,
    _embedded: {
      'wp:featuredmedia': ingredient.image ? [{ source_url: ingredient.image }] : [],
      'wp:term': [
        seasonStr ? [{
          id: 0,
          name: seasonStr,
          slug: seasonStr.toLowerCase(),
          taxonomy: 'season'
        }] : [],
        ingredient.category ? [{
          id: 0,
          name: ingredient.category,
          slug: ingredient.category.toLowerCase(),
          taxonomy: 'category'
        }] : []
      ].filter(arr => arr.length > 0)
    },
    acf: {
      season: seasonStr,
      allergens: ingredient.allergens,
      allergy_risk: ingredient.allergy_risk,
      start_age: ingredient.start_age,
      expert_name: ingredient.expert?.name,
      expert_title: ingredient.expert?.title,
      expert_avatar: ingredient.expert?.image,
      expert_note: ingredient.expert?.note,
      is_expert_verified: ingredient.expert?.approved,
    }
  };
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
  if (!authorId || authorId < 1) return null;
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
  const allTerms: TaxonomyTerm[] = [];
  
  for (const taxonomy of postTaxonomies) {
    try {
      const url = `${API_BASE_URL}/wp/v2/${taxonomy}?post=${postId}`;
      const res = await fetch(url, { headers: getHeaders() });
      if (res.ok) {
        const terms = await res.json();
        allTerms.push(...terms.map((t: TaxonomyTerm) => ({ ...t, taxonomy })));
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
    const embeddedAuthor = updatedPost._embedded?.author;
    const hasAuthor = embeddedAuthor && embeddedAuthor.length > 0;
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
    const embeddedTerms = updatedPost._embedded?.['wp:term'];
    const hasTerms = embeddedTerms && embeddedTerms.length > 0;
    if (!hasTerms && post.id && post.type) {
      const terms = await getTermsByPostId(post.id, post.type);
      if (terms.length > 0) {
        // Taxonomy'lere göre grupla
        const groupedTerms: Record<string, TaxonomyTerm[]> = {};
        terms.forEach(term => {
          if (term.taxonomy && !groupedTerms[term.taxonomy]) {
            groupedTerms[term.taxonomy] = [];
          }
          if (term.taxonomy) {
            groupedTerms[term.taxonomy].push(term);
          }
        });
        
        // wp:term formatında düzenle - taxonomy'si olan terimleri kullan
        const termArrays = Object.values(groupedTerms).map(group => 
          group.map(term => ({
            ...term,
            taxonomy: term.taxonomy as string // taxonomy zorunlu
          }))
        );
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

// 1. İçerik Arama (GÜNCELLENDİ: kg/v1 endpoint'leri kullan)
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
  let useKgApi = true;
  
  if (type === 'posts') {
    endpoint = API_ENDPOINTS.POSTS;
    useKgApi = false; // Posts still use wp/v2
  } else if (type === 'ingredients') {
    endpoint = API_ENDPOINTS.INGREDIENTS_SEARCH;
    useKgApi = true;
  }

  // For kg/v1 endpoints, use query parameter based on API design:
  // - Recipes use 'search' parameter: /kg/v1/recipes?search={query}
  // - Ingredients use 'q' parameter: /kg/v1/ingredients/search?q={query}
  // This reflects the backend API implementation
  const queryParam = useKgApi && type === 'ingredients' ? 'q' : 'search';
  const embedParam = useKgApi ? '' : '&_embed'; // kg/v1 doesn't need _embed
  const url = `${API_BASE_URL}${endpoint}?${queryParam}=${encodeURIComponent(query)}${embedParam}&per_page=10`;

  try {
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`API Hatası: ${res.status}`);
    
    let data = await res.json();
    
    // If using kg/v1 API, convert to WpPost format
    if (useKgApi) {
      if (type === 'recipes') {
        data = data.map((item: KgRecipeResponse) => mapKgRecipeToWpPost(item));
      } else if (type === 'ingredients') {
        data = data.map((item: KgIngredientResponse) => mapKgIngredientToWpPost(item));
      }
    } else {
      // For wp/v2 API, hydrate the data
      data = await hydratePostData(data);
    }
    
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

// 3. Post'u URL ile çek (GÜNCELLENDİ: kg/v1 endpoint kullan)
export const getPostByUrl = async (url: string): Promise<WpPost | null> => {
  try {
    // URL'den slug çıkar
    // Örnek: https://kidsgourmet.com.tr/tarifler/avokadolu-pure -> avokadolu-pure
    const urlParts = url.split('/').filter(Boolean);
    const slug = urlParts[urlParts.length - 1];
    
    // Post type'ı belirle (tarifler, malzemeler, vb.)
    let endpoint = '';
    let postType = 'posts';
    let useKgApi = false;
    
    if (url.includes('/tarifler/') || url.includes('/recipes/')) {
      endpoint = API_ENDPOINTS.RECIPES_BY_SLUG(slug);
      postType = 'recipes';
      useKgApi = true;
    } else if (url.includes('/malzemeler/') || url.includes('/ingredients/')) {
      endpoint = API_ENDPOINTS.INGREDIENTS_BY_SLUG(slug);
      postType = 'ingredients';
      useKgApi = true;
    } else {
      endpoint = API_ENDPOINTS.POSTS_BY_SLUG(slug);
      postType = 'posts';
      useKgApi = false;
    }
    
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers: getHeaders() });
    if (!res.ok) return null;
    
    const data = await res.json();
    
    // kg/v1 returns single object for slug lookup, wp/v2 returns array
    if (useKgApi) {
      // kg/v1 API returns single object
      if (postType === 'recipes') {
        return mapKgRecipeToWpPost(data as KgRecipeResponse);
      } else if (postType === 'ingredients') {
        return mapKgIngredientToWpPost(data as KgIngredientResponse);
      }
    } else {
      // wp/v2 API returns array
      if (Array.isArray(data) && data.length > 0) {
        const postWithType = { ...data[0], type: postType };
        const posts = await hydratePostData([postWithType]);
        return posts[0];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Get Post By URL Error:', error);
    return null;
  }
};

// 4. Post'u ID ile çek (GÜNCELLENDİ: kg/v1 endpoint kullan)
export const getPostById = async (
  id: number, 
  type: 'recipes' | 'posts' | 'ingredients'
): Promise<WpPost | null> => {
  try {
    let endpoint = '';
    let useKgApi = false;
    
    if (type === 'recipes') {
      endpoint = API_ENDPOINTS.RECIPES_BY_ID(id);
      useKgApi = true;
    } else if (type === 'ingredients') {
      endpoint = API_ENDPOINTS.INGREDIENTS_BY_ID(id);
      useKgApi = true;
    } else {
      endpoint = API_ENDPOINTS.POSTS_BY_ID(id);
      useKgApi = false;
    }
    
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers: getHeaders() });
    if (!res.ok) return null;
    
    const data = await res.json();
    
    // Convert kg/v1 response to WpPost format
    if (useKgApi) {
      if (type === 'recipes') {
        return mapKgRecipeToWpPost(data as KgRecipeResponse);
      } else if (type === 'ingredients') {
        return mapKgIngredientToWpPost(data as KgIngredientResponse);
      }
    } else {
      // wp/v2 API - hydrate the data
      const postWithType = { ...data, type };
      const posts = await hydratePostData([postWithType]);
      return posts[0];
    }
    
    return null;
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