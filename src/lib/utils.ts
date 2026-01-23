import { WpPost, TemplateData, TemplateType } from '@/types';

// Yardımcı fonksiyonlar
const decodeHtmlEntities = (text: string): string => {
  return text
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—');
};

const stripHtml = (html: string): string => {
  return html.replace(/(<([^>]+)>)/gi, '').trim();
};

const parseIngredients = (post: WpPost): string[] => {
  if (!post.acf?.ingredients) return [];
  
  const raw = post.acf.ingredients;
  
  if (typeof raw === 'string') {
    const stringRaw = raw as string;
    return stringRaw.split('\n').filter(Boolean).map((s: string) => s.trim());
  }
  
  if (Array.isArray(raw)) {
    return raw.map(item => {
      if (typeof item === 'string') return item.trim();
      if (typeof item === 'object' && item !== null) {
        const obj = item as { ingredient_name?: string; malzeme?: string; name?: string };
        return (obj.ingredient_name || obj.malzeme || obj.name || '').trim();
      }
      return '';
    }).filter(Boolean);
  }
  
  return [];
};

// Post type'ı normalize et (WordPress bazen plural, bazen singular döner)
const normalizePostType = (type: string): TemplateType => {
  const normalized = type.toLowerCase();
  if (normalized === 'recipe' || normalized === 'recipes') return 'recipe';
  if (normalized === 'ingredient' || normalized === 'ingredients') return 'guide';
  // Diğer tüm tipler (post, posts, page, vb.) blog olarak kabul edilir
  return 'blog';
};

export const mapWpPostToTemplate = (post: WpPost): TemplateData => {
  
  // 1. Taxonomy'leri Parse Et
  const terms = post._embedded?.['wp:term']?.flat() || [];
  
  // Taxonomy'leri bul - slug veya taxonomy adına göre
  const findTerm = (taxonomyNames: string[]) => {
    return terms.find(t => 
      taxonomyNames.some(name => 
        t.taxonomy === name || 
        t.taxonomy?.toLowerCase() === name.toLowerCase()
      )
    );
  };
  
  const ageGroupTerm = findTerm(['age-group', 'age_group', 'yas-grubu']);
  const mealTypeTerm = findTerm(['meal-type', 'meal_type', 'ogun-tipi']);
  const categoryTerm = findTerm(['category', 'kategori']);
  const seasonTerm = findTerm(['season', 'mevsim']);
  
  // 2. Yazar Bilgilerini Çek (Avatar dahil)
  const authorData = post._embedded?.['author']?.[0];
  const authorName = authorData?.name || 'KidsGourmet';
  // Avatar URL'lerini kontrol et - 96, 48, veya herhangi biri
  const avatarUrls = authorData?.avatar_urls;
  const authorAvatar = avatarUrls?.['96'] || 
                       avatarUrls?.['48'] || 
                       (avatarUrls ? Object.values(avatarUrls)[0] : '') || 
                       '';
  
  // 3. Uzman Bilgilerini Çek (ACF'den)
  const expertName = post.acf?.expert_name || '';
  const expertTitle = post.acf?.expert_title || 'Beslenme Uzmanı';
  const expertAvatar = post.acf?.expert_avatar || '';
  const expertNote = post.acf?.expert_note || '';
  const isExpertVerified = post.acf?.is_expert_verified ?? false;
  
  // 4. Görsel URL
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  
  // 5. Şablon Tipini Belirle
  const templateType = normalizePostType(post.type);
  
  // 6. CPT'ye Özel Kategori/Etiket Belirle
  let category = '';
  if (templateType === 'recipe') {
    // Tarifler için yaş grubu göster (kategori değil)
    category = ageGroupTerm?.name || '';
  } else if (templateType === 'guide') {
    // Malzemeler için mevsim veya "Beslenme Rehberi"
    category = seasonTerm?.name || 'Beslenme Rehberi';
  } else {
    // Blog yazıları için kategori
    category = categoryTerm?.name || 'Blog';
  }
  
  // 7. Malzemeleri Parse Et
  const ingredients = parseIngredients(post);
  
  // 8. Alerjen Bilgilerini Parse Et
  let allergens: string[] = [];
  if (post.acf?.allergens) {
    const allergensRaw = post.acf.allergens;
    if (Array.isArray(allergensRaw)) {
      allergens = allergensRaw.filter(Boolean);
    } else if (typeof allergensRaw === 'string') {
      // Type assertion needed because TypeScript can't narrow union type properly
      const stringAllergens = allergensRaw as string;
      allergens = stringAllergens.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  }
  
  // 9. Excerpt/Description
  const excerpt = stripHtml(post.excerpt?.rendered || post.content?.rendered || '').slice(0, 200);
  
  return {
    id: post.id,
    templateType,
    title: decodeHtmlEntities(post.title.rendered),
    excerpt,
    image: imageUrl,
    category,
    
    // Tarif detayları
    ingredients,
    ageGroup: ageGroupTerm?.name || '',
    ageGroupColor: ageGroupTerm?.meta?.color_code || '#FF8A65',
    mealType: mealTypeTerm?.name || '',
    prepTime: post.acf?.preparation_time || '',
    difficulty: post.acf?.difficulty || '',
    
    // Malzeme detayları
    season: seasonTerm?.name || post.acf?.season || '',
    allergens,
    allergyRisk: post.acf?.allergy_risk || '',
    startAge: post.acf?.start_age || '',
    benefits: post.acf?.benefits || '',
    
    // Görünürlük toggle'ları (varsayılan tümü açık)
    visibility: {
      ageGroup: true,
      mealType: true,
      prepTime: true,
      ingredients: true,
      season: true,
      allergens: true,
      category: true,
      excerpt: true,
    },
    
    // Yazar - her zaman doldur
    author: {
      name: authorName,
      avatarUrl: authorAvatar,
      isVisible: true, // Varsayılan açık
    },
    
    // Uzman - ACF'de varsa doldur
    expert: {
      name: expertName || authorName, // Uzman yoksa yazar adını kullan
      title: expertTitle,
      avatarUrl: expertAvatar || authorAvatar, // Uzman avatarı yoksa yazar avatarını kullan
      note: expertNote,
      isVisible: !!expertName, // Uzman adı varsa göster
      isVerified: isExpertVerified,
    },
    
    // Watermark (varsayılan)
    watermark: {
      isVisible: true,
      url: '',
      position: 'top-right',
      opacity: 1,
      scale: 1,
    },
    
    theme: 'modern',
  };
};