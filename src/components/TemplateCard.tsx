'use client';

import React from 'react';
import { Instagram, ImageIcon, ChefHat, FileText, BookOpen } from 'lucide-react';
import { TemplateCardProps } from '@/types';
import SocialCard from '@/components/SocialCard';
import { DEFAULTS } from '@/lib/constants';

const TemplateCard: React.FC<TemplateCardProps> = ({
  id,
  name,
  description,
  previewImage,
  templateType,
  format,
  layout,
  tags,
  onSelect
}) => {
  
  // Preview data - daha zengin örnek veri
  const previewData = {
    id: 'preview',
    templateType,
    title: templateType === 'recipe' ? 'Havuçlu Bebek Püresi' : 
           templateType === 'guide' ? 'Brokoli Rehberi' : 'Sağlıklı Beslenme',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80',
    category: templateType === 'recipe' ? '6-9 Ay' : templateType === 'guide' ? 'Kış' : 'Beslenme',
    ingredients: ['Havuç', 'Patates', 'Zeytinyağı'],
    excerpt: 'Bebeğiniz için sağlıklı ve lezzetli tarifler.',
    ageGroup: '6-9 Ay',
    ageGroupColor: '#FF8A65',
    mealType: 'Kahvaltı',
    prepTime: '15 dk',
    season: 'Kış',
    allergens: [],
    allergyRisk: '',
    visibility: {
      ageGroup: true, mealType: true, prepTime: true, ingredients: true,
      season: true, allergens: true, category: true, excerpt: true
    },
    author: { name: 'KidsGourmet', avatarUrl: '', isVisible: false },
    expert: { name: 'Dyt. Ayşe Yılmaz', title: 'Beslenme Uzmanı', avatarUrl: '', note: '', isVisible: true, isVerified: true },
    watermark: { isVisible: false, url: '', position: 'top-right' as const, opacity: 1, scale: 1 },
    theme: 'modern' as const
  };

  // Önizleme boyutları - format'a göre
  const previewAspect = format === 'story' ? 'aspect-[9/16]' : 'aspect-square';
  const cardWidth = format === 'story' ? 1080 : 1080;
  const cardHeight = format === 'story' ? 1920 : 1080;
  
  // Container boyutuna göre scale hesapla
  // Story için container yaklaşık 250px genişlik, 444px yükseklik
  // Post için container yaklaşık 250px genişlik, 250px yükseklik
  const scaleValue = format === 'story' ? 0.23 : 0.23; // 250/1080 ≈ 0.23
  
  const getTypeIcon = () => {
    switch (templateType) {
      case 'recipe': return <ChefHat size={20} />;
      case 'blog': return <FileText size={20} />;
      case 'guide': return <BookOpen size={20} />;
    }
  };

  const getFormatBadge = () => {
    if (format === 'story') {
      return (
        <div className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          <Instagram size={14} />
          Story
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          <ImageIcon size={14} />
          Post
        </div>
      );
    }
  };

  return (
    <div 
      className="group relative bg-[#1E1E1E] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-[#FF7F3F]/50 cursor-pointer"
      onClick={onSelect}
    >
      {/* Preview Container */}
      <div className={`${previewAspect} bg-[#0a0a0a] relative overflow-hidden`}>
        {/* Scaled SocialCard Preview */}
        <div 
          className="absolute top-0 left-0 origin-top-left"
          style={{
            width: cardWidth,
            height: cardHeight,
            transform: `scale(${scaleValue})`,
          }}
        >
          <SocialCard 
            format={format} 
            data={previewData} 
            layout={layout}
          />
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <button className="bg-[#FF7F3F] text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Şablonu Seç
          </button>
        </div>

        {/* Format Badge */}
        <div className="absolute top-3 right-3 z-10">
          {getFormatBadge()}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-white font-bold text-base leading-tight mb-1">{name}</h3>
            <p className="text-gray-400 text-sm leading-snug line-clamp-2">{description}</p>
          </div>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="bg-white/5 text-gray-500 px-2 py-0.5 rounded text-xs">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;
