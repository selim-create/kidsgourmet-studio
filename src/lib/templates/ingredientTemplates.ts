import { Template } from '@/types';

export const INGREDIENT_TEMPLATES: Template[] = [
  {
    id: 'ingredient-info-story',
    name: 'Bilgi Kartı',
    description: 'Beslenme bilgileri için detaylı kart',
    templateType: 'guide',
    format: 'story',
    layout: 'info',
    features: ['seasonBadge', 'allergenWarning', 'startAge', 'benefits'],
    tags: ['info', 'story', 'educational']
  },
  {
    id: 'ingredient-warning-story',
    name: 'Uyarı Kartı',
    description: 'Alerjen uyarıları ve riskler için',
    templateType: 'guide',
    format: 'story',
    layout: 'warning',
    features: ['allergenWarning', 'allergyRisk', 'seasonBadge'],
    tags: ['warning', 'story', 'alert']
  },
  {
    id: 'ingredient-simple-post',
    name: 'Basit Malzeme',
    description: 'Sade malzeme tanıtımı',
    templateType: 'guide',
    format: 'post',
    layout: 'simple',
    features: ['seasonBadge'],
    tags: ['simple', 'post', 'basic']
  },
  {
    id: 'ingredient-seasonal-story',
    name: 'Mevsimlik Rehber',
    description: 'Mevsime özel beslenme önerileri',
    templateType: 'guide',
    format: 'story',
    layout: 'featured',
    features: ['seasonBadge', 'benefits', 'expertCard'],
    tags: ['seasonal', 'story', 'expert']
  },
  {
    id: 'ingredient-allergy-post',
    name: 'Alerji Bilgilendirme',
    description: 'Alerji riski ve önlemler',
    templateType: 'guide',
    format: 'post',
    layout: 'warning',
    features: ['allergenWarning', 'allergyRisk', 'startAge'],
    tags: ['allergy', 'post', 'safety']
  },
  {
    id: 'ingredient-expert-story',
    name: 'Uzman Önerisi',
    description: 'Uzman görüşlü beslenme rehberi',
    templateType: 'guide',
    format: 'story',
    layout: 'detailed',
    features: ['expertCard', 'seasonBadge', 'benefits', 'startAge'],
    tags: ['expert', 'story', 'detailed']
  },
  {
    id: 'ingredient-benefits-post',
    name: 'Fayda Kartı',
    description: 'Sağlık faydalarına odaklı',
    templateType: 'guide',
    format: 'post',
    layout: 'info',
    features: ['benefits', 'seasonBadge', 'startAge'],
    tags: ['benefits', 'post', 'health']
  }
];
