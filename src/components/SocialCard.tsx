'use client';

import React, { forwardRef } from 'react';
import { Sparkles, User, FileText, BookOpen, CheckCircle2, ChefHat } from 'lucide-react';
import { TemplateData, SocialFormat } from '@/types';

interface SocialCardProps {
  format: SocialFormat;
  data: TemplateData;
}

const getProxyUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) return url;
  return `/api/proxy?url=${encodeURIComponent(url)}`;
};

const SocialCard = forwardRef<HTMLDivElement, SocialCardProps>(({ format, data }, ref) => {
  
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
          {data.watermark.url ? (
            <img 
              src={data.watermark.url} 
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

      {/* --- KATMAN 3: KATEGORİ ROZETİ (Sabit Sol Üst) --- */}
      <div className="absolute top-12 left-12 z-40">
         <div className="bg-[#4CAF50] text-white px-6 py-3 rounded-full text-2xl font-bold uppercase tracking-widest shadow-xl flex items-center gap-3 border border-white/20 backdrop-blur-md">
            {data.templateType === 'recipe' && <ChefHat size={28} />}
            {data.templateType === 'blog' && <FileText size={28} />}
            {data.templateType === 'guide' && <BookOpen size={28} />}
            {data.category}
         </div>
      </div>

      {/* --- KATMAN 4: İÇERİK ALANI --- */}
      <div className="absolute inset-0 p-16 flex flex-col justify-end z-30 pb-24">
        
        {/* --- TARİF ŞABLONU --- */}
        {data.templateType === 'recipe' && (
          <div className="flex flex-col gap-8">
             <div className="space-y-4">
                <div className="w-32 h-2 bg-[#FF7F3F] rounded-full shadow-lg mb-4"></div>
                <h1 className={`${titleSize} font-bold leading-[1.1] drop-shadow-xl text-balance`}>
                  {data.title}
                </h1>
             </div>

             {data.ingredients && data.ingredients.length > 0 && (
               <div className="flex flex-wrap gap-4 mt-4">
                 {data.ingredients.slice(0, format === 'story' ? 6 : 4).map((ing, i) => (
                   <span key={i} className="bg-white/10 backdrop-blur-md border border-white/20 text-[26px] px-6 py-3 rounded-2xl text-white font-medium shadow-lg">
                     {ing}
                   </span>
                 ))}
                 {data.ingredients.length > (format === 'story' ? 6 : 4) && (
                    <span className="bg-[#FF7F3F] text-white text-[26px] px-5 py-3 rounded-2xl font-bold shadow-lg">
                      +{data.ingredients.length - (format === 'story' ? 6 : 4)}
                    </span>
                 )}
               </div>
             )}

             {data.expert.isVisible && (
               <div className="flex items-center gap-5 mt-6 bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-3xl w-fit pr-10">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#FF7F3F] border-4 border-[#FF7F3F] shrink-0 shadow-lg">
                     <User size={40} />
                  </div>
                  <div>
                     <div className="flex items-center gap-2">
                        <p className="text-[32px] font-bold text-white leading-none">{data.expert.name}</p>
                        {data.expert.isVerified && <CheckCircle2 size={28} className="text-blue-400 fill-white" />}
                     </div>
                     <p className="text-[22px] text-gray-300 uppercase tracking-wide mt-1">{data.expert.title}</p>
                  </div>
               </div>
             )}
          </div>
        )}

        {/* --- BLOG ŞABLONU --- */}
        {data.templateType === 'blog' && (
          <div className="flex flex-col items-center text-center gap-8 mb-10">
             <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border-2 border-white/30 shadow-2xl mb-4">
                <FileText size={48} />
             </div>
             
             <h1 className={`${titleSize} font-bold leading-[1.1] drop-shadow-2xl max-w-[90%]`}>
               {data.title}
             </h1>
             
             <div className="w-32 h-1 bg-white/50 rounded-full"></div>

             <p className={`${subTitleSize} text-gray-100 font-medium leading-relaxed max-w-[90%] drop-shadow-md line-clamp-5`}>
               {data.excerpt}
             </p>

             {data.author.isVisible && (
                <div className="mt-8 px-8 py-3 rounded-full border border-white/30 bg-black/20 backdrop-blur-md">
                   <span className="text-[24px] uppercase tracking-widest font-bold">Yazar: {data.author.name}</span>
                </div>
             )}
          </div>
        )}

        {/* --- REHBER (GUIDE) ŞABLONU --- */}
        {data.templateType === 'guide' && (
           <div className="mb-8">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-3 h-full bg-[#FF7F3F]"></div>
                  
                  <h1 className={`${titleSize} font-bold text-white mb-6 leading-tight drop-shadow-lg pl-6`}>
                    {data.title}
                  </h1>
                  
                  <p className={`${subTitleSize} text-gray-100 leading-relaxed font-normal pl-6 opacity-95`}>
                    {data.excerpt}
                  </p>

                  <div className="mt-8 pt-8 border-t border-white/20 flex items-center gap-3 pl-6 text-[22px] text-orange-200 font-bold uppercase tracking-widest">
                     <BookOpen size={28} />
                     KidsGourmet Beslenme Rehberi
                  </div>
              </div>
           </div>
        )}

      </div>
      
      {/* Süsleme: İnce Beyaz Çerçeve (Story Havası) */}
      <div className="absolute inset-0 border-[12px] border-white/10 pointer-events-none z-50"></div>

    </div>
  );
});

SocialCard.displayName = 'SocialCard';

export default SocialCard;