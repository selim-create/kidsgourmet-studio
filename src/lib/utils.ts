import { WpPost, TemplateData, TemplateType } from '@/types';

// Yardımcı fonksiyonlar
const decodeHtmlEntities = (text: string): string => {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
};

const stripHtml = (html: string): string => {
  return html.replace(/(<([^>]+)>)/gi, '').trim();
};

const parseIngredients = (post: WpPost): string[] => {
  if (!post.acf?.ingredients) return [];
  
  const raw = post.acf.ingredients;
  
  // Check if it's a string
  if (typeof raw === 'string') {
    return (raw as string).split('\n').filter(Boolean);
  }
  
  // Check if it's an array
  if (Array.isArray(raw)) {
    return raw.map(item => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item !== null) {
        const obj = item as { ingredient_name?: string; malzeme?: string };
        return obj.ingredient_name || obj.malzeme || '';
      }
      return '';
    }).filter(Boolean);
  }
  
  return [];
};

export const mapWpPostToTemplate = (post: WpPost): TemplateData => {
  
  // 1. Taxonomy'leri Parse Et
  const terms = post._embedded?.['wp:term']?.flat() || [];
  
  const ageGroupTerm = terms.find(t => t.taxonomy === 'age-group');
  const mealTypeTerm = terms.find(t => t.taxonomy === 'meal-type');
  const categoryTerm = terms.find(t => t.taxonomy === 'category');
  const seasonTerm = terms.find(t => t.taxonomy === 'season');
  
  // 2. Yazar Bilgilerini Çek
  const authorData = post._embedded?.['author']?.[0];
  const authorName = authorData?.name || 'KidsGourmet';
  const authorAvatar = authorData?.avatar_urls?.['96'] || '';
  
  // 3. Uzman Bilgilerini Çek
  const expertName = post.acf?.expert_name || authorName;
  const expertTitle = post.acf?.expert_title || 'Beslenme Uzmanı';
  const expertAvatar = post.acf?.expert_avatar || authorAvatar;
  const expertNote = post.acf?.expert_note || '';
  
  // 4. Görsel URL
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  
  // 5. Şablon Tipini Belirle
  let templateType: TemplateType = 'blog';
  if (post.type === 'recipe') templateType = 'recipe';
  if (post.type === 'ingredient') templateType = 'guide';
  
  // 6. Kategori/Etiket Belirle
  let category = 'KidsGourmet';
  if (templateType === 'recipe' && ageGroupTerm) {
    category = ageGroupTerm.name;
  } else if (templateType === 'guide') {
    category = 'Beslenme Rehberi';
  } else if (categoryTerm) {
    category = categoryTerm.name;
  }
  
  // 7. Malzemeleri Parse Et
  const ingredients = parseIngredients(post);
  
  // 8. Alerjen Bilgilerini Parse Et
  const allergens = post.acf?.allergens || [];
  
  return {
    id: post.id,
    templateType,
    title: decodeHtmlEntities(post.title.rendered),
    excerpt: stripHtml(post.excerpt?.rendered || '').slice(0, 150),
    image: imageUrl,
    category,
    
    // Tarif detayları
    ingredients,
    ageGroup: ageGroupTerm?.name || '',
    ageGroupColor: ageGroupTerm?.meta?.color_code || '#FF8A65',
    mealType: mealTypeTerm?.name || '',
    prepTime: post.acf?.preparation_time || '',
    
    // Malzeme detayları
    season: seasonTerm?.name || post.acf?.season || '',
    allergens,
    allergyRisk: post.acf?.allergy_risk || '',
    
    // Yazar
    author: {
      name: authorName,
      avatarUrl: authorAvatar,
      isVisible: true,
    },
    
    // Uzman
    expert: {
      name: expertName,
      title: expertTitle,
      avatarUrl: expertAvatar,
      note: expertNote,
      isVisible: true,
      isVerified: post.acf?.is_expert_verified ?? true,
    },
    
    // Watermark (varsayılan)
    watermark: {
      isVisible: true,
      url: '', // Boş bırak, component'te default kullanılacak
      position: 'top-right',
      opacity: 1,
      scale: 1,
    },
    
    theme: 'modern',
  };
};