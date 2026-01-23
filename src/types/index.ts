// Backend'den (WordPress) gelen ham veri
export interface WpPost {
  id: number;
  date: string;
  slug: string;
  type: string; // 'post', 'recipe', 'ingredient' vb.
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; code?: string }>;
    'author'?: Array<{ name: string; avatar_urls?: { '96': string } }>;
  };
  acf?: {
    ingredients?: string[];
    preparation_time?: string;
    difficulty?: string;
    chef_title?: string;
    is_expert_verified?: boolean;
    expert_name?: string;
    expert_title?: string;
  };
}

// Şablon Tipleri (GÜNCELLENDİ: 'quote' gitti, 'guide' geldi)
export type TemplateType = 'recipe' | 'blog' | 'guide';

export type SocialFormat = 'story' | 'post';
export type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

// Editör Veri Yapısı
export interface TemplateData {
  id: number | string;
  templateType: TemplateType; 
  
  // İçerik
  title: string;
  excerpt?: string; 
  image: string; 
  category: string;
  
  // Tarif Detayları
  ingredients?: string[];

  // Kişi Bilgileri
  author: {
    name: string;
    avatarUrl: string;
    isVisible: boolean;
  };
  
  expert: {
    name: string;
    title: string;
    isVisible: boolean;
    isVerified: boolean;
  };

  // Filigran Ayarları
  watermark: {
    isVisible: boolean;
    url: string;
    position: WatermarkPosition;
    opacity: number;
    scale: number;
  };

  theme: 'modern' | 'dark' | 'colorful';
}