import { Template } from '@/types';

export const BLOG_TEMPLATES: Template[] = [
  {
    id: 'blog-featured-story',
    name: 'Öne Çıkan Yazı',
    description: 'Dikkat çekici blog yazısı sunumu',
    previewImage: '/templates/blog-featured-story.png',
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
    previewImage: '/templates/blog-quote-story.png',
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
    previewImage: '/templates/blog-minimal-post.png',
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
    previewImage: '/templates/blog-author-story.png',
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
    previewImage: '/templates/blog-expert-post.png',
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
    previewImage: '/templates/blog-simple-post.png',
    templateType: 'blog',
    format: 'post',
    layout: 'simple',
    features: ['categoryBadge', 'excerpt'],
    tags: ['simple', 'post', 'basic']
  }
];
