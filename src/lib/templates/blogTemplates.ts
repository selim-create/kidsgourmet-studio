import { Template } from '@/types';

export const BLOG_TEMPLATES: Template[] = [
  {
    id: 'blog-featured-story',
    name: 'Öne Çıkan Yazı',
    description: 'Dikkat çekici blog yazısı sunumu',
    templateType: 'blog',
    format: 'story',
    layout: 'featured',
    features: ['categoryBadge', 'authorCard', 'excerpt'],
    tags: ['featured', 'story', 'highlighted']
  },
  {
    id: 'blog-quote-story',
    name: 'Alıntı Kartı',
    description: 'Alıntı ve özetlere odaklanan tasarım',
    templateType: 'blog',
    format: 'story',
    layout: 'quote',
    features: ['excerpt', 'authorCard'],
    tags: ['quote', 'story', 'text-focused']
  },
  {
    id: 'blog-minimal-post',
    name: 'Minimal Yazı',
    description: 'Sade blog gönderisi',
    templateType: 'blog',
    format: 'post',
    layout: 'minimal',
    features: ['categoryBadge'],
    tags: ['minimal', 'post', 'clean']
  },
  {
    id: 'blog-author-story',
    name: 'Yazar Odaklı',
    description: 'Yazar bilgilerini öne çıkaran tasarım',
    templateType: 'blog',
    format: 'story',
    layout: 'classic',
    features: ['authorCard', 'categoryBadge', 'excerpt'],
    tags: ['author', 'story', 'profile']
  },
  {
    id: 'blog-expert-post',
    name: 'Uzman Görüşü',
    description: 'Uzman notları ve görüşleri için',
    templateType: 'blog',
    format: 'post',
    layout: 'detailed',
    features: ['expertCard', 'categoryBadge', 'excerpt'],
    tags: ['expert', 'post', 'opinion']
  },
  {
    id: 'blog-simple-post',
    name: 'Basit Blog',
    description: 'Hızlı paylaşım için basit tasarım',
    templateType: 'blog',
    format: 'post',
    layout: 'simple',
    features: ['categoryBadge', 'excerpt'],
    tags: ['simple', 'post', 'basic']
  }
];
