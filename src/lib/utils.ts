import { WpPost, TemplateData, TemplateType } from '@/types';

export const mapWpPostToTemplate = (post: WpPost): TemplateData => {
  
  // 1. Görseli Bul
  let imageUrl = '';
  const embeddedMedia = post._embedded?.['wp:featuredmedia'];
  
  if (embeddedMedia && embeddedMedia[0] && !embeddedMedia[0].code && embeddedMedia[0].source_url) {
    imageUrl = embeddedMedia[0].source_url;
  }

  // 2. Yazar
  let authorName = 'KidsGourmet';
  let authorAvatar = '';
  
  if (post._embedded?.['author']?.[0]) {
    authorName = post._embedded['author'][0].name;
    authorAvatar = post._embedded['author'][0].avatar_urls?.['96'] || '';
  }

  // 3. İçerik Temizleme
  const plainTitle = post.title.rendered.replace(/&amp;/g, '&').replace(/&#8217;/g, "'");
  const plainExcerpt = post.excerpt?.rendered.replace(/(<([^>]+)>)/gi, "") || "";

  // 4. Şablon Tipi Belirleme
  let templateType: TemplateType = 'blog'; // Varsayılan
  if (post.type === 'recipe') templateType = 'recipe';
  if (post.type === 'ingredient') templateType = 'guide'; // Malzemeler 'Rehber' olur

  // 5. Malzemeler (Sadece tarifler için anlamlı)
  let ingredients: string[] = [];
  if (post.acf) {
      if (typeof post.acf.ingredients === 'string') {
         ingredients = (post.acf.ingredients as string).split('\n');
      } else if (Array.isArray(post.acf.ingredients)) {
         ingredients = post.acf.ingredients.map((item: any) => item.ingredient_name || item.malzeme || item); 
      }
  }
  // Fallback: Content içinden liste çekme
  if (ingredients.length === 0 && post.content?.rendered && typeof window !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content.rendered, 'text/html');
    const listItems = doc.querySelectorAll('ul li, ol li');
    if (listItems.length > 0) {
      listItems.forEach((li, index) => {
        if (index < 6) ingredients.push(li.textContent || '');
      });
    }
  }

  return {
    id: post.id,
    templateType: templateType,
    title: plainTitle,
    excerpt: plainExcerpt.slice(0, 150) + (plainExcerpt.length > 150 ? '...' : ''), // Uzun özetleri kırp
    image: imageUrl,
    category: post.type === 'ingredient' ? 'Beslenme Rehberi' : 'KidsGourmet',
    
    ingredients: ingredients.length > 0 ? ingredients : [],
    
    author: {
        name: authorName,
        avatarUrl: authorAvatar,
        isVisible: true
    },

    expert: {
      name: post.acf?.expert_name || authorName,
      title: post.acf?.expert_title || 'Beslenme Uzmanı',
      isVisible: true,
      isVerified: post.acf?.is_expert_verified || true
    },

    watermark: {
      isVisible: true, // Varsayılan açık gelsin
      url: '/assets/logo-placeholder.png', // Logo yoksa placeholder
      position: 'top-right',
      opacity: 1,
      scale: 1
    },
    theme: 'modern'
  };
};