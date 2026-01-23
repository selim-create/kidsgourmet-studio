'use client';

import React from 'react';
import { 
  User, FileText, BookOpen, CheckCircle2, ChefHat, 
  Clock, AlertTriangle, Leaf, Baby, Star, Quote, Info 
} from 'lucide-react';
import { TemplateData, SocialFormat } from '@/types';

interface LayoutProps {
  data: TemplateData;
  format: SocialFormat;
  backgroundUrl: string;
  titleSize: string;
  subTitleSize: string;
  logoSize: string;
  getProxyUrl: (url: string) => string;
}

// --- YARDIMCI BİLEŞENLER (Kod tekrarını önlemek ama görseli zengin tutmak için) ---

// 1. Güvenli Görsel Bileşeni (Hata Çözümü İçin Kritik)
const SafeImage = ({ src, alt, className, fallbackIcon: Icon = User }: any) => {
  if (!src || src === '') {
    return (
      <div className={`flex items-center justify-center bg-gray-200 text-gray-400 ${className}`}>
        <Icon size={24} />
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} />;
};

// 2. Kategori Rozeti
const Badge = ({ icon: Icon, text, color = "bg-white/20", textColor = "text-white" }: any) => (
  <div className={`${color} backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[18px] font-bold ${textColor} shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform`}>
    {Icon && <Icon size={20} />}
    <span className="tracking-wide uppercase text-[15px]">{text}</span>
  </div>
);

// --- LAYOUT TASARIMLARI ---

// 1. MODERN LAYOUT (Premium Dergi Kapağı Havası)
export const ModernLayout: React.FC<LayoutProps> = ({ data, format, titleSize, subTitleSize, getProxyUrl }) => {
  const safeTop = format === 'story' ? 'pt-[260px]' : 'pt-16';
  const safeBottom = format === 'story' ? 'pb-[280px]' : 'pb-16';
  const safeSides = 'px-10';
  
  return (
    <div className={`absolute inset-0 ${safeSides} ${safeTop} ${safeBottom} flex flex-col justify-end z-30`}>
      
      {data.templateType === 'recipe' && (
        <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-10 duration-700 fade-in">
          {/* Metadata Badges */}
          <div className="flex items-center gap-3 flex-wrap mb-2">
            {data.visibility?.ageGroup && data.ageGroup && (
              <Badge icon={Baby} text={data.ageGroup} color="bg-[#FF7F3F]" />
            )}
            {data.visibility?.prepTime && data.prepTime && (
              <Badge icon={Clock} text={data.prepTime} />
            )}
            {data.visibility?.mealType && data.mealType && (
              <Badge icon={ChefHat} text={data.mealType} />
            )}
          </div>
          
          {/* Title Area */}
          <div className="relative">
            <div className="w-20 h-2 bg-gradient-to-r from-[#FF7F3F] to-orange-400 mb-5 rounded-full shadow-[0_0_20px_rgba(255,127,63,0.5)]"></div>
            <h1 className={`${titleSize} font-extrabold leading-[1.05] drop-shadow-2xl text-white tracking-tight`}>
              {data.title}
            </h1>
          </div>
          
          {/* Ingredients Grid */}
          {data.visibility?.ingredients && data.ingredients && data.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2 my-2">
              {data.ingredients.slice(0, format === 'story' ? 5 : 4).map((ing, i) => (
                <span key={i} className="bg-black/40 backdrop-blur-md border border-white/10 text-[18px] px-4 py-2 rounded-xl text-white/95 font-medium shadow-sm">
                  {ing}
                </span>
              ))}
              {data.ingredients.length > (format === 'story' ? 5 : 4) && (
                <span className="bg-[#FF7F3F]/90 backdrop-blur-md px-4 py-2 rounded-xl text-white font-bold text-[18px]">
                  +{data.ingredients.length - (format === 'story' ? 5 : 4)}
                </span>
              )}
            </div>
          )}
          
          {/* Expert Card */}
          {data.expert.isVisible && (
            <div className="mt-2 flex items-center gap-4 p-4 bg-gradient-to-r from-black/80 to-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
              <SafeImage 
                src={getProxyUrl(data.expert.avatarUrl || '')} 
                className="w-14 h-14 rounded-full object-cover border-2 border-[#FF7F3F] shadow-lg"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[20px] text-white leading-none">{data.expert.name}</span>
                  {data.expert.isVerified && <CheckCircle2 size={18} className="text-[#FF7F3F]" />}
                </div>
                <span className="text-[15px] text-gray-300 font-medium tracking-wide uppercase mt-1 opacity-80">{data.expert.title}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {(data.templateType === 'blog' || data.templateType === 'guide') && (
        <div className="flex flex-col items-start gap-6 mb-8">
           <div className="bg-[#FF7F3F] text-white px-5 py-1.5 rounded-lg text-[18px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2">
              <FileText size={20} />
              {data.category || 'Blog'}
           </div>
          <h1 className={`${titleSize} font-bold leading-[1.1] drop-shadow-2xl text-white`}>
            {data.title}
          </h1>
          {data.visibility?.excerpt && data.excerpt && (
            <div className="bg-black/50 backdrop-blur-md border-l-[6px] border-[#FF7F3F] p-6 rounded-r-2xl max-w-[95%]">
               <p className={`${subTitleSize} text-gray-100 font-medium leading-relaxed drop-shadow-md line-clamp-4`}>
                {data.excerpt}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 2. CLASSIC LAYOUT (Temiz, Yapılandırılmış, Modern Kart Stili)
export const ClassicLayout: React.FC<LayoutProps> = ({ data, format, getProxyUrl }) => (
  <div className="absolute inset-0 flex flex-col z-30 justify-between pb-12">
    {/* Header */}
    <div className={`mt-${format === 'story' ? '28' : '16'} mx-8`}>
      <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl relative overflow-hidden text-center">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF7F3F] via-orange-500 to-red-500"></div>
         <span className="inline-block mb-3 text-[#FF7F3F] font-bold tracking-[0.2em] uppercase text-lg">
           {data.category}
         </span>
         <h1 className="text-[44px] font-extrabold text-gray-900 leading-tight">
           {data.title}
         </h1>
      </div>
    </div>
    
    {/* Footer Content */}
    <div className={`mb-${format === 'story' ? '40' : '16'} mx-8`}>
       {data.templateType === 'recipe' && data.visibility?.ingredients && (
         <div className="bg-black/70 backdrop-blur-lg p-6 rounded-[32px] border border-white/20 shadow-2xl mb-6">
           <div className="flex flex-wrap justify-center gap-3">
             {data.ingredients?.slice(0, 6).map((ing, i) => (
                <span key={i} className="text-white bg-white/10 px-4 py-2 rounded-full text-[18px] font-medium border border-white/10">
                  {ing}
                </span>
             ))}
           </div>
         </div>
       )}
       
       {data.expert.isVisible && (
         <div className="flex justify-center items-center gap-3 bg-white/95 backdrop-blur px-8 py-4 rounded-full w-fit mx-auto shadow-xl">
            <SafeImage 
                src={getProxyUrl(data.expert.avatarUrl || '')} 
                className="w-10 h-10 rounded-full bg-gray-200"
            />
            <div>
              <p className="text-gray-900 font-bold text-[18px] leading-tight">{data.expert.name}</p>
              <p className="text-gray-500 text-[14px] leading-tight">{data.expert.title}</p>
            </div>
         </div>
       )}
    </div>
  </div>
);

// 3. MINIMAL LAYOUT (Yüksek Moda / Lüks Havası)
export const MinimalLayout: React.FC<LayoutProps> = ({ data, titleSize }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-30 p-12 text-center">
    <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
    
    <div className="relative border border-white/30 p-14 backdrop-blur-[2px] max-w-[90%]">
      {/* Köşe Süslemeleri */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>

      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF7F3F] px-6 py-1 text-white text-[14px] font-bold tracking-[0.3em] uppercase shadow-lg">
        Gourmet
      </div>
      
      <h1 className={`${titleSize} font-serif font-medium drop-shadow-2xl italic tracking-wide mb-8`}>
        {data.title}
      </h1>
      
      <div className="w-16 h-[2px] bg-white/60 mx-auto mb-8"></div>
      
      {data.excerpt && (
        <p className="text-[26px] text-white/90 font-light leading-relaxed">
          {data.excerpt}
        </p>
      )}
    </div>
  </div>
);

// 4. DETAILED LAYOUT (Bilgi Yoğun - Kart Yapısı)
export const DetailedLayout: React.FC<LayoutProps> = ({ data, format, getProxyUrl }) => (
  <div className="absolute inset-0 z-30 flex flex-col justify-end">
    {/* Background Gradient to ensure readability above the card */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

    <div className={`bg-white relative rounded-t-[48px] p-10 pb-24 shadow-[0_-20px_60px_rgba(0,0,0,0.7)] ${format === 'story' ? 'min-h-[45%]' : 'min-h-[42%]'}`}>
       
       {/* Handle Bar (Visual cue for swipe up) */}
       <div className="w-20 h-1.5 bg-gray-300 rounded-full mx-auto mb-8"></div>
       
       <div className="flex items-start justify-between mb-8">
          <div className="flex-1 pr-4">
            <span className="text-[#FF7F3F] font-bold uppercase tracking-wider text-sm mb-2 block flex items-center gap-2">
              <CheckCircle2 size={16} /> {data.category}
            </span>
            <h1 className="text-[40px] font-extrabold text-gray-900 leading-[1.1] tracking-tight">{data.title}</h1>
          </div>
          
          {data.visibility?.ageGroup && (
            <div className="shrink-0 bg-orange-50 rounded-2xl p-4 text-center min-w-[90px] border border-orange-100">
               <Baby className="mx-auto text-[#FF7F3F] mb-1" size={28} />
               <span className="block text-gray-900 font-bold text-lg">{data.ageGroup}</span>
            </div>
          )}
       </div>

       {data.templateType === 'recipe' && data.visibility?.ingredients && (
         <div className="space-y-4">
           <h3 className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em] border-b border-gray-100 pb-2">Hazırlanış Malzemeleri</h3>
           <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
             {data.ingredients?.map((ing, i) => (
               <li key={i} className="flex items-start gap-2 text-gray-700 text-[18px] font-medium leading-tight">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#FF7F3F] mt-2 shrink-0"></span>
                 {ing}
               </li>
             ))}
           </ul>
         </div>
       )}

       {data.expert.isVisible && (
         <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
            <SafeImage 
                src={getProxyUrl(data.expert.avatarUrl || '')} 
                className="w-14 h-14 rounded-full bg-gray-200 object-cover border border-gray-100"
            />
            <div>
              <p className="text-gray-900 font-bold text-[20px]">{data.expert.name}</p>
              <p className="text-gray-500 text-[16px]">{data.expert.title}</p>
            </div>
         </div>
       )}
    </div>
  </div>
);

// 5. FEATURED LAYOUT (Büyük Başlık, Vurgulu)
export const FeaturedLayout: React.FC<LayoutProps> = ({ data, titleSize }) => (
  <div className="absolute inset-0 flex items-center justify-center z-30 p-12">
    <div className="bg-black/60 backdrop-blur-xl p-12 rounded-[48px] border border-white/10 text-center shadow-2xl relative max-w-full">
       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-400 p-4 rounded-full shadow-[0_0_30px_rgba(250,204,21,0.6)]">
         <Star className="text-black fill-black" size={40} />
       </div>
       <h1 className={`${titleSize} font-bold text-white mt-8 mb-6 leading-tight drop-shadow-xl`}>{data.title}</h1>
       <div className="w-24 h-1.5 bg-yellow-400 mx-auto mb-8 rounded-full"></div>
       <p className="text-[28px] text-gray-100 font-light leading-relaxed">{data.excerpt}</p>
    </div>
  </div>
);

// 6. INFO LAYOUT (Eğitici İçerik)
export const InfoLayout: React.FC<LayoutProps> = ({ data }) => (
  <div className="absolute inset-0 p-12 flex flex-col justify-end z-30 pb-32">
    <div className="bg-blue-600/90 backdrop-blur-lg p-12 rounded-[40px] shadow-2xl text-white border-l-8 border-blue-300">
       <div className="flex items-center gap-4 mb-6">
         <div className="bg-white/20 p-4 rounded-full"><Info size={32} /></div>
         <span className="text-blue-200 font-bold text-xl uppercase tracking-widest">Biliyor muydunuz?</span>
       </div>
       <h1 className="text-[52px] font-bold mb-6 leading-[1.1]">{data.title}</h1>
       <p className="text-[28px] leading-relaxed opacity-95 font-medium">{data.benefits || data.excerpt}</p>
    </div>
  </div>
);

// 7. WARNING LAYOUT (Alerjen Uyarısı vb.)
export const WarningLayout: React.FC<LayoutProps> = ({ data }) => (
  <div className="absolute inset-0 flex items-center justify-center z-30 p-10">
    <div className="bg-red-600 p-12 rounded-[50px] shadow-[0_20px_70px_rgba(220,38,38,0.7)] text-white border-4 border-red-400 relative overflow-hidden">
       <div className="absolute -right-10 -top-10 text-red-800 opacity-30">
          <AlertTriangle size={300} />
       </div>
       <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-white text-red-600 p-3 rounded-full shadow-lg"><AlertTriangle size={32} /></div>
            <span className="text-[28px] font-bold uppercase tracking-widest text-red-100">Önemli Uyarı</span>
          </div>
          <h1 className="text-[60px] font-extrabold leading-tight mb-8">{data.title}</h1>
          <div className="flex flex-wrap gap-4">
            {data.allergens?.map((a, i) => (
              <span key={i} className="bg-white text-red-600 px-8 py-3 rounded-full text-[24px] font-bold shadow-md transform hover:scale-105 transition-transform">{a}</span>
            ))}
          </div>
       </div>
    </div>
  </div>
);

// 8. QUOTE LAYOUT (Alıntı)
export const QuoteLayout: React.FC<LayoutProps> = ({ data, titleSize }) => (
  <div className="absolute inset-0 flex items-center justify-center z-30 p-16 text-center">
    <div className="bg-black/50 p-14 rounded-[60px] backdrop-blur-md border border-white/10 shadow-2xl">
      <Quote className="mx-auto text-[#FF7F3F] mb-6 fill-[#FF7F3F] opacity-80" size={64} />
      <h1 className={`${titleSize} font-bold leading-tight relative z-10 drop-shadow-xl text-white italic`}>
        "{data.title}"
      </h1>
      {data.author.isVisible && (
        <div className="mt-10 flex flex-col items-center gap-2">
           <div className="w-16 h-1 bg-[#FF7F3F] rounded-full mb-2"></div>
           <p className="text-[32px] font-medium text-gray-200">{data.author.name}</p>
        </div>
      )}
    </div>
  </div>
);

// 9. SIMPLE LAYOUT (Sade)
export const SimpleLayout: React.FC<LayoutProps> = ({ data, titleSize }) => (
  <div className="absolute inset-0 p-12 flex flex-col justify-end z-30 pb-32">
     <div className="bg-gradient-to-t from-black via-black/90 to-transparent p-10 -m-12 pt-40">
        <h1 className={`${titleSize} font-bold mb-6 drop-shadow-lg text-white`}>{data.title}</h1>
        <p className="text-[30px] text-gray-200 leading-relaxed max-w-[90%]">{data.excerpt}</p>
     </div>
  </div>
);