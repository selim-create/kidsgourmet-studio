import { Template } from '@/types';

export const RECIPE_TEMPLATES: Template[] = [
  {
    id: 'recipe-modern-story',
    name: 'Modern Tarif',
    description: 'Tam ekran görsel, gradient overlay ile şık tarif sunumu',
    previewImage: '/templates/recipe-modern-story.png',
    templateType: 'recipe',
    format: 'story',
    layout: 'modern',
    features: ['ageGroupBadge', 'mealTypeBadge', 'ingredientsList', 'prepTime'],
    tags: ['modern', 'story', 'gradient']
  },
  {
    id: 'recipe-classic-story',
    name: 'Klasik Tarif',
    description: 'Geleneksel tarif kartı tasarımı',
    previewImage: '/templates/recipe-classic-story.png',
    templateType: 'recipe',
    format: 'story',
    layout: 'classic',
    features: ['ageGroupBadge', 'expertCard'],
    tags: ['classic', 'story', 'traditional']
  },
  {
    id: 'recipe-minimal-post',
    name: 'Minimal Tarif',
    description: 'Sade ve temiz tarif görseli',
    previewImage: '/templates/recipe-minimal-post.png',
    templateType: 'recipe',
    format: 'post',
    layout: 'minimal',
    features: ['ageGroupBadge'],
    tags: ['minimal', 'post', 'clean']
  },
  {
    id: 'recipe-detailed-post',
    name: 'Detaylı Tarif',
    description: 'Tüm tarif bilgilerini içeren kapsamlı tasarım',
    previewImage: '/templates/recipe-detailed-post.png',
    templateType: 'recipe',
    format: 'post',
    layout: 'detailed',
    features: ['ageGroupBadge', 'mealTypeBadge', 'ingredientsList', 'prepTime', 'expertCard'],
    tags: ['detailed', 'post', 'comprehensive']
  },
  {
    id: 'recipe-expert-story',
    name: 'Uzman Tarifi',
    description: 'Uzman önerileriyle öne çıkan tarif',
    previewImage: '/templates/recipe-expert-story.png',
    templateType: 'recipe',
    format: 'story',
    layout: 'featured',
    features: ['ageGroupBadge', 'mealTypeBadge', 'expertCard', 'ingredientsList'],
    tags: ['expert', 'story', 'featured']
  },
  {
    id: 'recipe-quick-post',
    name: 'Hızlı Tarif',
    description: 'Pratik ve hızlı tarifler için ideal',
    previewImage: '/templates/recipe-quick-post.png',
    templateType: 'recipe',
    format: 'post',
    layout: 'simple',
    features: ['prepTime', 'ingredientsList'],
    tags: ['quick', 'post', 'simple']
  }
];
