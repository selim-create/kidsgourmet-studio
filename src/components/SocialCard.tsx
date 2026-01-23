'use client';

import React, { forwardRef } from 'react';
import { 
  ChefHat, FileText, BookOpen 
} from 'lucide-react';
import { TemplateData, SocialFormat, TemplateLayout } from '@/types';
import { 
  ModernLayout, 
  ClassicLayout, 
  MinimalLayout, 
  DetailedLayout, 
  FeaturedLayout, 
  InfoLayout, 
  WarningLayout, 
  QuoteLayout, 
  SimpleLayout 
} from '@/components/layouts';

interface SocialCardProps {
  format: SocialFormat;
  data: TemplateData;
  defaultWatermarkUrl?: string;
  layout?: TemplateLayout;
}

const getProxyUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) return url;
  return `/api/proxy?url=${encodeURIComponent(url)}`;
};

const SocialCard = forwardRef<HTMLDivElement, SocialCardProps>(({ format, data, defaultWatermarkUrl = '', layout = 'modern' }, ref) => {
  
  // High-Res Dimensions (Instagram Native)
  // Story: 1080x1920
  // Post: 1080x1080
  const dimensions = format === 'story' 
    ? 'w-[1080px] h-[1920px]' 
    : 'w-[1080px] h-[1080px]';

  // Typography Scaling - Adjusted for "Editorial" look
  const titleSize = format === 'story' ? 'text-[76px]' : 'text-[68px]';
  const subTitleSize = format === 'story' ? 'text-[32px]' : 'text-[28px]';
  const logoSize = format === 'story' ? 'text-[42px]' : 'text-[38px]';

  const backgroundUrl = getProxyUrl(data.image);

  const getWatermarkPosition = () => {
    switch (data.watermark.position) {
      case 'top-left': return 'top-16 left-12';
      case 'top-right': return 'top-16 right-12';
      case 'bottom-left': return 'bottom-16 left-12';
      case 'bottom-right': return 'bottom-16 right-12';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default: return 'top-16 right-12';
    }
  };

  const renderLayout = () => {
    const layoutProps = {
      data,
      format,
      backgroundUrl,
      titleSize,
      subTitleSize,
      logoSize,
      getProxyUrl
    };

    switch (layout) {
      case 'classic': return <ClassicLayout {...layoutProps} />;
      case 'minimal': return <MinimalLayout {...layoutProps} />;
      case 'detailed': return <DetailedLayout {...layoutProps} />;
      case 'featured': return <FeaturedLayout {...layoutProps} />;
      case 'info': return <InfoLayout {...layoutProps} />;
      case 'warning': return <WarningLayout {...layoutProps} />;
      case 'quote': return <QuoteLayout {...layoutProps} />;
      case 'simple': return <SimpleLayout {...layoutProps} />;
      case 'modern': default: return <ModernLayout {...layoutProps} />;
    }
  };

  return (
    <div 
      ref={ref} 
      className={`${dimensions} relative overflow-hidden bg-[#0a0a0a] text-white shrink-0 shadow-2xl`}
      style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }} 
    >
      {/* --- LAYER 1: BACKGROUND IMAGE (Safe Handling) --- */}
      <div className="absolute inset-0 z-0">
        {backgroundUrl && backgroundUrl !== '' ? (
          <img 
            src={backgroundUrl} 
            alt="Background" 
            className="w-full h-full object-cover scale-[1.01]" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-950 flex flex-col items-center justify-center p-20 text-center">
             <ChefHat size={120} className="text-gray-700 mb-8 opacity-50" />
             <span className="text-gray-600 text-5xl font-bold uppercase tracking-widest opacity-50">Görsel Seçilmedi</span>
          </div>
        )}
        
        {/* Cinematic Overlays */}
        {layout !== 'detailed' && layout !== 'minimal' && (
           <>
             {/* Bottom darkness for text readability */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90" />
             {/* Top slight darkness for status bar visibility */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-60" />
           </>
        )}
      </div>

      {/* --- LAYER 2: TEXTURE / NOISE (Premium Feel) --- */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-10 mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* --- LAYER 3: WATERMARK --- */}
      {data.watermark.isVisible && (
        <div className={`absolute z-50 ${getWatermarkPosition()} pointer-events-none`}>
          {(data.watermark.url || defaultWatermarkUrl) ? (
            <img 
              src={getProxyUrl(data.watermark.url || defaultWatermarkUrl || '/kg-logo.png')} 
              style={{ opacity: data.watermark.opacity, transform: `scale(${data.watermark.scale})` }}
              className="max-w-[280px] max-h-[160px] object-contain drop-shadow-xl"
              alt="Brand"
            />
          ) : (
             <div 
              style={{ opacity: data.watermark.opacity, transform: `scale(${data.watermark.scale})` }}
              className="flex items-center gap-2"
            >
               <span className={`${logoSize} font-extrabold tracking-tighter text-white drop-shadow-md`}>KidsGourmet</span>
            </div>
          )}
        </div>
      )}

      {/* --- LAYER 4: CATEGORY BADGE (For Modern Layout) --- */}
      {layout === 'modern' && (
        <div className="absolute top-16 left-12 z-40">
           <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full text-xl font-bold uppercase tracking-widest shadow-xl flex items-center gap-3">
              {data.templateType === 'recipe' && <ChefHat size={26} className="text-[#FF7F3F]" />}
              {data.templateType === 'blog' && <FileText size={26} className="text-[#FF7F3F]" />}
              {data.templateType === 'guide' && <BookOpen size={26} className="text-[#FF7F3F]" />}
              {data.category}
           </div>
        </div>
      )}

      {/* --- LAYOUT CONTENT --- */}
      {renderLayout()}

    </div>
  );
});

SocialCard.displayName = 'SocialCard';

export default SocialCard;