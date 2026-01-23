import { Template } from '@/types';

export const RECIPE_TEMPLATES: Template[] = [
  {
    id: 'recipe-modern-story',
    name: 'Modern Tarif',
    description: 'Tam ekran görsel, gradient overlay ile şık tarif sunumu',
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
    templateType: 'recipe',
    format: 'post',
    layout: 'simple',
    features: ['prepTime', 'ingredientsList'],
    tags: ['quick', 'post', 'simple']
  }
];
