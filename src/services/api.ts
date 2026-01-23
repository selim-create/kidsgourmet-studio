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
const hydrateWithImages = async (posts: any[]): Promise<WpPost[]> => {
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

// 1. İçerik Arama (GÜNCELLENDİ: ingredients eklendi)
export const searchContent = async (query: string, type: 'recipes' | 'posts' | 'ingredients' = 'recipes'): Promise<WpPost[]> => {
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