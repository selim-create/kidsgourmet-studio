// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.kidsgourmet.com.tr/wp-json';

// Namespaces
export const KG_API_NAMESPACE = '/kg/v1';
export const WP_API_NAMESPACE = '/wp/v2';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: `${KG_API_NAMESPACE}/auth/login`,
  AUTH_ME: `${KG_API_NAMESPACE}/auth/me`,
  
  // İçerik
  RECIPES: `${WP_API_NAMESPACE}/recipes`,
  POSTS: `${WP_API_NAMESPACE}/posts`,
  
  // Beslenme Rehberi (Malzemeler) - DÜZELTİLDİ
  INGREDIENTS: `${WP_API_NAMESPACE}/ingredients`,
  
  MEDIA: `${WP_API_NAMESPACE}/media`,
  SEARCH: `${KG_API_NAMESPACE}/search`,
  
  // Yeni endpoint'ler
  POSTS_BY_SLUG: (slug: string) => `${WP_API_NAMESPACE}/posts?slug=${slug}&_embed`,
  RECIPES_BY_SLUG: (slug: string) => `${WP_API_NAMESPACE}/recipes?slug=${slug}&_embed`,
  INGREDIENTS_BY_SLUG: (slug: string) => `${WP_API_NAMESPACE}/ingredients?slug=${slug}&_embed`,
  
  POSTS_BY_ID: (id: number) => `${WP_API_NAMESPACE}/posts/${id}?_embed`,
  RECIPES_BY_ID: (id: number) => `${WP_API_NAMESPACE}/recipes/${id}?_embed`,
  INGREDIENTS_BY_ID: (id: number) => `${WP_API_NAMESPACE}/ingredients/${id}?_embed`,
  
  // Site ayarları (watermark için)
  SITE_OPTIONS: `${KG_API_NAMESPACE}/options`,
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'kg_studio_token',
  USER: 'kg_studio_user',
};

// Authorized Roles
export const AUTHORIZED_ROLES = ['administrator', 'editor', 'author', 'contributor', 'kg_expert'];

// Varsayılan Değerler
export const DEFAULTS = {
  WATERMARK_URL: '/kg-logo.svg',
  PLACEHOLDER_IMAGE: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af',
  EXPERT_AVATAR: '/expert-placeholder.png',
  AUTHOR_AVATAR: '/author-placeholder.png',
};

// Watermark Pozisyonları
export const WATERMARK_POSITIONS = [
  { id: 'top-left', label: 'Sol Üst', icon: '↖' },
  { id: 'top-right', label: 'Sağ Üst', icon: '↗' },
  { id: 'center', label: 'Merkez', icon: '◉' },
  { id: 'bottom-left', label: 'Sol Alt', icon: '↙' },
  { id: 'bottom-right', label: 'Sağ Alt', icon: '↘' },
] as const;

// Template Boyutları
export const TEMPLATE_DIMENSIONS = {
  STORY: { width: 1080, height: 1920, label: 'Story (9:16)', ratio: '9:16' },
  POST_SQUARE: { width: 1080, height: 1080, label: 'Post (1:1)', ratio: '1:1' },
  POST_PORTRAIT: { width: 1080, height: 1350, label: 'Post (4:5)', ratio: '4:5' },
};

// Design System Colors
export const BRAND_COLORS = {
  primary: '#FF8A65',
  secondary: '#AED581',
  blue: '#81D4FA',
  yellow: '#FFF176',
  dark: '#455A64',
  light: '#FFFBE6',
};

// Taxonomy slugları
export const TAXONOMIES = {
  AGE_GROUP: 'age-group',
  MEAL_TYPE: 'meal-type',
  DIET_TYPE: 'diet-type',
  CATEGORY: 'category',
  SEASON: 'season',
};

// Quick Preset Temaları (Faz 5 için hazırlık)
export const QUICK_PRESETS = [
  { id: 'default', name: 'Varsayılan', colors: { primary: '#FF7F3F', secondary: '#4CAF50' } },
  { id: 'ramazan', name: 'Ramazan Özel', colors: { primary: '#1B5E20', secondary: '#FFD700' } },
  { id: 'yaz', name: 'Yaz Özel', colors: { primary: '#FF9800', secondary: '#03A9F4' } },
  { id: 'kis', name: 'Kış Özel', colors: { primary: '#1976D2', secondary: '#E3F2FD' } },
];