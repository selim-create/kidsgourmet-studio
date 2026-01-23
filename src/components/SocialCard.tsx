'use client';

import React, { forwardRef } from 'react';
import { 
  User, FileText, BookOpen, CheckCircle2, ChefHat, 
  Clock, AlertTriangle, Leaf, Baby
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
  
  // Format Boyutları
  const dimensions = format === 'story' 
    ? 'w-[1080px] h-[1920px]'  // Gerçek Story Boyutu (Scale ile küçültülerek gösteriliyor)
    : 'w-[1080px] h-[1080px]'; // Gerçek Post Boyutu

  // Dinamik Font Boyutları (Format bazlı)
  const titleSize = format === 'story' ? 'text-[80px]' : 'text-[70px]';
  const subTitleSize = format === 'story' ? 'text-[32px]' : 'text-[28px]';
  const logoSize = format === 'story' ? 'text-[40px]' : 'text-[36px]';

  const backgroundUrl = getProxyUrl(data.image);

  // Filigran Pozisyonu
  const getWatermarkPosition = () => {
    switch (data.watermark.position) {
      case 'top-left': return 'top-12 left-12';
      case 'top-right': return 'top-12 right-12';
      case 'bottom-left': return 'bottom-12 left-12';
      case 'bottom-right': return 'bottom-12 right-12';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default: return 'top-12 right-12';
    }
  };

  // Render layout based on layout prop
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
      case 'classic':
        return <ClassicLayout {...layoutProps} />;
      case 'minimal':
        return <MinimalLayout {...layoutProps} />;
      case 'detailed':
        return <DetailedLayout {...layoutProps} />;
      case 'featured':
        return <FeaturedLayout {...layoutProps} />;
      case 'info':
        return <InfoLayout {...layoutProps} />;
      case 'warning':
        return <WarningLayout {...layoutProps} />;
      case 'quote':
        return <QuoteLayout {...layoutProps} />;
      case 'simple':
        return <SimpleLayout {...layoutProps} />;
      case 'modern':
      default:
        return <ModernLayout {...layoutProps} />;
    }
  };

  return (
    <div 
      ref={ref} 
      className={`${dimensions} relative overflow-hidden bg-[#121212] text-white font-sans shrink-0`}
      style={{ fontFamily: "'Outfit', sans-serif" }} // Google font (Layout'ta ekli olmalı)
    >
      {/* --- KATMAN 1: ARKA PLAN GÖRSELİ --- */}
      <div className="absolute inset-0 z-0">
        {backgroundUrl ? (
          <img 
            src={backgroundUrl} 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
             <span className="text-gray-500 text-4xl font-bold opacity-30 uppercase tracking-widest">Görsel Yok</span>
          </div>
        )}
        {/* Kaliteli Okunabilirlik Gradyanı */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
      </div>

      {/* --- KATMAN 2: FİLİGRAN (Dinamik) --- */}
      {data.watermark.isVisible && (
        <div className={`absolute z-50 ${getWatermarkPosition()} flex items-center justify-center pointer-events-none drop-shadow-2xl`}>
          {(data.watermark.url || defaultWatermarkUrl) ? (
            <img 
              src={getProxyUrl(data.watermark.url || defaultWatermarkUrl || '/kg-logo.png')} 
              style={{ opacity: data.watermark.opacity, transform: `scale(${data.watermark.scale})` }}
              className="max-w-[250px] max-h-[150px] object-contain"
              alt="Watermark"
            />
          ) : (
            <div 
              style={{ opacity: data.watermark.opacity, transform: `scale(${data.watermark.scale})` }}
              className="flex flex-col items-end"
            >
               <span className={`${logoSize} font-extrabold tracking-tighter leading-none text-white drop-shadow-md`}>KidsGourmet</span>
            </div>
          )}
        </div>
      )}

      {/* --- KATMAN 3: KATEGORİ ROZETİ (Modern layout only) --- */}
      {layout === 'modern' && (
        <div className="absolute top-12 left-12 z-40">
           <div className="bg-[#4CAF50] text-white px-6 py-3 rounded-full text-2xl font-bold uppercase tracking-widest shadow-xl flex items-center gap-3 border border-white/20 backdrop-blur-md">
              {data.templateType === 'recipe' && <ChefHat size={28} />}
              {data.templateType === 'blog' && <FileText size={28} />}
              {data.templateType === 'guide' && <BookOpen size={28} />}
              {data.category}
           </div>
        </div>
      )}

      {/* --- LAYOUT CONTENT --- */}
      {renderLayout()}
      
      {/* Süsleme: İnce Beyaz Çerçeve (Story Havası) */}
      <div className="absolute inset-0 border-[12px] border-white/10 pointer-events-none z-50"></div>

    </div>
  );
});

SocialCard.displayName = 'SocialCard';

export default SocialCard;