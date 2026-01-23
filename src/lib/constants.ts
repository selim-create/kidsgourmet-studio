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
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'kg_studio_token',
  USER: 'kg_studio_user',
};

// Authorized Roles
export const AUTHORIZED_ROLES = ['administrator', 'editor', 'author', 'contributor', 'kg_expert'];

// Template Dimensions
export const TEMPLATE_DIMENSIONS = {
  STORY: { width: 1080, height: 1920, label: 'Story (9:16)' },
  POST_SQUARE: { width: 1080, height: 1080, label: 'Post (1:1)' },
  POST_PORTRAIT: { width: 1080, height: 1350, label: 'Post (4:5)' },
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