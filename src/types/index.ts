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
    'author'?: Array<{ 
      name: string; 
      avatar_urls?: { '96': string; '48': string }; 
      id: number;
      slug: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
      // Taxonomy meta (age-group için renk kodu vb.)
      meta?: {
        color_code?: string;
      };
    }>>;
  };
  acf?: {
    // Tarif alanları
    ingredients?: string[] | Array<{ ingredient_name?: string; malzeme?: string }>;
    preparation_time?: string;
    difficulty?: string;
    
    // Uzman alanları
    expert_name?: string;
    expert_title?: string;
    expert_avatar?: string;
    is_expert_verified?: boolean;
    expert_note?: string;
    
    // Malzeme (Ingredient) alanları
    season?: string;
    allergens?: string[];
    allergy_risk?: string;
    start_age?: string;
    benefits?: string;
  };
}

// Stock Image API Types
export interface StockImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  photographer: string;
  photographerUrl: string;
  source: 'pexels' | 'unsplash';
  width: number;
  height: number;
  alt: string;
}

export type ImageLibrarySource = 'pexels' | 'unsplash' | 'all';

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
  ageGroup?: string;        // YENİ: "6-9 Ay", "9-12 Ay" vb.
  ageGroupColor?: string;   // YENİ: "#FF8A65" vb.
  mealType?: string;        // YENİ: "Kahvaltı", "Ana Yemek" vb.
  prepTime?: string;        // YENİ: "15 dk"
  
  // Malzeme Detayları
  season?: string;          // YENİ: "Kış", "Yaz", "Tüm Yıl"
  allergens?: string[];     // YENİ: ["Süt", "Yumurta"]
  allergyRisk?: string;     // YENİ: "Düşük", "Orta", "Yüksek"
  startAge?: string;        // YENİ: Malzemeler için başlangıç yaşı
  benefits?: string;        // YENİ: Sağlık faydaları
  difficulty?: string;      // YENİ: Tarif zorluk seviyesi

  // Kişi Bilgileri
  author: {
    name: string;
    avatarUrl: string;
    isVisible: boolean;
  };
  
  expert: {
    name: string;
    title: string;
    avatarUrl?: string;     // YENİ: Uzman profil fotoğrafı
    note?: string;          // YENİ: Uzman notu
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