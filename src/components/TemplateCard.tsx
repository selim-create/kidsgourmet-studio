'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Instagram, ImageIcon, ChefHat, FileText, BookOpen, ArrowRight } from 'lucide-react';
import { TemplateCardProps } from '@/types';
import SocialCard from '@/components/SocialCard';

const TemplateCard: React.FC<TemplateCardProps> = ({
  id,
  name,
  description,
  templateType,
  format,
  layout,
  tags,
  onSelect
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.23); // Başlangıç değeri
  const [isLoaded, setIsLoaded] = useState(false);

  // Zenginleştirilmiş Önizleme Verisi
  const previewData = {
    id: 'preview',
    templateType,
    title: templateType === 'recipe' ? 'Yaz Meyveleri' : 
           templateType === 'guide' ? 'Ek Gıda Rehberi' : 'Beslenme İpuçları',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80',
    category: templateType === 'recipe' ? '6-9 Ay' : templateType === 'guide' ? 'Başlangıç' : 'Sağlık',
    ingredients: ['Şeftali', 'Muz', 'Yulaf'],
    excerpt: 'Bebeğiniz için ferahlatıcı ve besleyici yaz tarifleri serisi.',
    ageGroup: '6-9 Ay',
    ageGroupColor: '#FF8A65',
    mealType: 'Ara Öğün',
    prepTime: '10 dk',
    season: 'Yaz',
    allergens: [],
    allergyRisk: 'Düşük',
    visibility: {
      ageGroup: true, mealType: true, prepTime: true, ingredients: true,
      season: true, allergens: true, category: true, excerpt: true
    },
    author: { name: 'KidsGourmet', avatarUrl: '', isVisible: false },
    expert: { name: 'Dyt. Ayşe Yılmaz', title: 'Uzman', avatarUrl: '', note: '', isVisible: true, isVerified: true },
    watermark: { isVisible: false, url: '', position: 'top-right' as const, opacity: 1, scale: 1 },
    theme: 'modern' as const
  };

  // Dinamik Scale Hesaplama
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // SocialCard'ın orijinal genişliği 1080px'dir.
        // Container genişliğini 1080'e bölerek scale oranını buluyoruz.
        const newScale = containerWidth / 1080;
        setScale(newScale);
        setIsLoaded(true);
      }
    };

    // İlk hesaplama
    updateScale();

    // Resize Observer ile boyut değişimlerini dinle
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Format'a göre Aspect Ratio belirleme
  // Story: 9/16, Post: 1/1 (Square)
  const aspectRatioClass = format === 'story' ? 'aspect-[9/16]' : 'aspect-square';
  const originalHeight = format === 'story' ? 1920 : 1080;

  const getFormatBadge = () => {
    const isStory = format === 'story';
    return (
      <div className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md border border-white/10
        ${isStory ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'}
      `}>
        {isStory ? <Instagram size={14} /> : <ImageIcon size={14} />}
        <span>{isStory ? 'Story' : 'Post'}</span>
      </div>
    );
  };

  return (
    <div 
      className="group flex flex-col bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#FF7F3F]/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer h-full"
      onClick={onSelect}
    >
      {/* Preview Container - Dinamik Boyutlandırma */}
      <div 
        ref={containerRef}
        className={`relative w-full ${aspectRatioClass} bg-[#0f0f0f] overflow-hidden border-b border-white/5`}
      >
        {/* Scaled Content Wrapper */}
        <div 
          className={`absolute top-0 left-0 origin-top-left transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            width: 1080,
            height: originalHeight,
            transform: `scale(${scale})`,
          }}
        >
          {/* SocialCard bileşenine pointer-events-none ekleyerek içindeki tıklamaları engelliyoruz */}
          <div className="pointer-events-none w-full h-full">
            <SocialCard 
              format={format} 
              data={previewData} 
              layout={layout}
            />
          </div>
        </div>

        {/* Hover Overlay - Profesyonel geçiş */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20 backdrop-blur-[2px]">
          <button className="flex items-center gap-2 bg-[#FF7F3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
            <span>Şablonu Düzenle</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Badges - Floating */}
        <div className="absolute top-3 right-3 z-10 transition-transform duration-300 group-hover:-translate-y-1">
          {getFormatBadge()}
        </div>
      </div>

      {/* Info Section - Minimalist ve Temiz */}
      <div className="p-5 flex flex-col gap-3 flex-1 bg-[#1a1a1a]">
        <div>
          <h3 className="text-white font-bold text-lg mb-1 group-hover:text-[#FF7F3F] transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 min-h-[2.5em]">
            {description}
          </p>
        </div>

        {/* Tags ve Meta */}
        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex gap-2 text-xs text-gray-500">
             {templateType === 'recipe' && <span className="flex items-center gap-1"><ChefHat size={12} /> Tarif</span>}
             {templateType === 'guide' && <span className="flex items-center gap-1"><BookOpen size={12} /> Rehber</span>}
          </div>
          
          {tags && tags.length > 0 && (
            <div className="flex gap-1">
              {tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-gray-400 text-[10px] uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;