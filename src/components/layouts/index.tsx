'use client';

import React from 'react';
import { 
  User, FileText, BookOpen, CheckCircle2, ChefHat, 
  Clock, AlertTriangle, Leaf, Baby 
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

// Story format için safe area sabitleri
const STORY_SAFE_AREA = {
  top: 280,    // px - status bar + header
  bottom: 300, // px - reply bar + swipe area  
  sides: 48,   // px - yan kenarlar
};

// Modern Layout - Full screen image with gradient overlay
export const ModernLayout: React.FC<LayoutProps> = ({ data, format, backgroundUrl, titleSize, subTitleSize, getProxyUrl }) => {
  // Story için güvenli padding, Post için normal
  const safeTop = format === 'story' ? 'pt-[280px]' : 'pt-12';
  const safeBottom = format === 'story' ? 'pb-[300px]' : 'pb-12';
  const safeSides = format === 'story' ? 'px-12' : 'px-10';
  
  return (
    <>
      {/* Content at bottom - safe area içinde */}
      <div className={`absolute inset-0 ${safeSides} ${safeTop} ${safeBottom} flex flex-col justify-end z-30`}>
        {data.templateType === 'recipe' && (
          <div className="flex flex-col gap-6">
            {/* Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              {data.visibility?.ageGroup && data.ageGroup && (
                <div 
                  className="px-5 py-2.5 rounded-full text-[22px] font-bold text-white shadow-lg flex items-center gap-2"
                  style={{ backgroundColor: data.ageGroupColor || '#FF8A65' }}
                >
                  <Baby size={22} />
                  {data.ageGroup}
                </div>
              )}
              {data.visibility?.mealType && data.mealType && (
                <div className="bg-white/20 backdrop-blur-md border border-white/30 px-5 py-2.5 rounded-full text-[22px] font-bold text-white shadow-lg flex items-center gap-2">
                  <ChefHat size={22} />
                  {data.mealType}
                </div>
              )}
              {data.visibility?.prepTime && data.prepTime && (
                <div className="bg-white/20 backdrop-blur-md border border-white/30 px-5 py-2.5 rounded-full text-[22px] font-bold text-white shadow-lg flex items-center gap-2">
                  <Clock size={22} />
                  {data.prepTime}
                </div>
              )}
            </div>
            
            {/* Accent Line */}
            <div className="w-24 h-1.5 bg-[#FF7F3F] rounded-full"></div>
            
            {/* Title */}
            <h1 className={`${titleSize} font-bold leading-[1.1] drop-shadow-xl`}>
              {data.title}
            </h1>
            
            {/* Ingredients */}
            {data.visibility?.ingredients && data.ingredients && data.ingredients.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {data.ingredients.slice(0, format === 'story' ? 5 : 4).map((ing, i) => (
                  <span key={i} className="bg-white/10 backdrop-blur-md border border-white/20 text-[20px] px-4 py-2 rounded-xl text-white font-medium">
                    {ing}
                  </span>
                ))}
                {data.ingredients.length > (format === 'story' ? 5 : 4) && (
                  <span className="bg-[#FF7F3F] text-white text-[20px] px-4 py-2 rounded-xl font-bold">
                    +{data.ingredients.length - (format === 'story' ? 5 : 4)}
                  </span>
                )}
              </div>
            )}
            
            {/* Expert Card */}
            {data.expert.isVisible && (
              <div className="flex items-center gap-3 mt-4 p-4 bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10">
                {data.expert.avatarUrl ? (
                  <img src={getProxyUrl(data.expert.avatarUrl)} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-[#FF7F3F]" />
                ) : (
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                    <User size={24} />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[22px]">{data.expert.name}</span>
                    {data.expert.isVerified && (
                      <CheckCircle2 size={20} className="text-green-400" />
                    )}
                  </div>
                  <span className="text-[16px] text-gray-300">{data.expert.title}</span>
                </div>
              </div>
            )}
          </div>
        )}
        {data.templateType === 'blog' && (
          <div className="flex flex-col items-center text-center gap-8 mb-10">
            {data.visibility?.category && data.category && (
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border-2 border-white/30 shadow-2xl mb-4">
                <FileText size={48} />
              </div>
            )}
            <h1 className={`${titleSize} font-bold leading-[1.1] drop-shadow-2xl max-w-[90%]`}>
              {data.title}
            </h1>
            <div className="w-32 h-1 bg-white/50 rounded-full"></div>
            {data.visibility?.excerpt && data.excerpt && (
              <p className={`${subTitleSize} text-gray-100 font-medium leading-relaxed max-w-[90%] drop-shadow-md line-clamp-5`}>
                {data.excerpt}
              </p>
            )}
          </div>
        )}
        {data.templateType === 'guide' && (
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-3 h-full bg-[#FF7F3F]"></div>
              {data.visibility?.season && data.season && (
                <div className="flex items-center gap-4 mb-6 flex-wrap pl-6">
                  <div className="bg-green-500 text-white px-6 py-3 rounded-full text-[24px] font-bold shadow-lg flex items-center gap-2">
                    <Leaf size={24} />
                    {data.season}
                  </div>
                </div>
              )}
              <h1 className={`${titleSize} font-bold text-white mb-6 leading-tight drop-shadow-lg pl-6`}>
                {data.title}
              </h1>
              {data.excerpt && (
                <p className={`${subTitleSize} text-gray-100 leading-relaxed font-normal pl-6 opacity-95`}>
                  {data.excerpt}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Classic Layout - Header at top, image in middle, footer at bottom
export const ClassicLayout: React.FC<LayoutProps> = ({ data, format, titleSize, subTitleSize, getProxyUrl }) => (
  <div className="absolute inset-0 flex flex-col z-30">
    {/* Header */}
    <div className="p-10 bg-gradient-to-r from-orange-500 to-red-500">
      <h1 className="text-[56px] font-bold text-white leading-tight">{data.title}</h1>
      {data.visibility?.category && data.category && (
        <span className="text-white/90 text-[28px] mt-2 block">{data.category}</span>
      )}
    </div>
    
    {/* Content in middle */}
    <div className="flex-1 flex items-end p-16 pb-24">
      {data.templateType === 'recipe' && data.visibility?.ingredients && data.ingredients && data.ingredients.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {data.ingredients.slice(0, 4).map((ing, i) => (
            <span key={i} className="bg-white/20 backdrop-blur-md border border-white/30 text-[24px] px-6 py-3 rounded-2xl text-white font-medium shadow-lg">
              {ing}
            </span>
          ))}
        </div>
      )}
    </div>
    
    {/* Footer with expert if visible */}
    {data.expert.isVisible && (
      <div className="p-8 bg-black/60 backdrop-blur-lg border-t border-white/10">
        <div className="flex items-center gap-4">
          {data.expert.avatarUrl ? (
            <img src={getProxyUrl(data.expert.avatarUrl)} alt={data.expert.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#FF7F3F]" />
          ) : (
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#FF7F3F] border-2 border-[#FF7F3F]">
              <User size={32} />
            </div>
          )}
          <div>
            <p className="font-bold text-white text-[28px]">{data.expert.name}</p>
            <p className="text-[18px] opacity-80 text-gray-300">{data.expert.title}</p>
          </div>
        </div>
      </div>
    )}
  </div>
);

// Minimal Layout - Only title and category centered
export const MinimalLayout: React.FC<LayoutProps> = ({ data, titleSize }) => (
  <div className="absolute inset-0 flex items-center justify-center z-30">
    <div className="bg-black/50 backdrop-blur-lg" />
    <div className="relative text-center p-16 max-w-[90%]">
      <span className="text-[28px] uppercase tracking-widest text-white/80 block mb-4">{data.category}</span>
      <h1 className={`${titleSize} font-bold drop-shadow-2xl`}>{data.title}</h1>
    </div>
  </div>
);

// Detailed Layout - Grid with all information
export const DetailedLayout: React.FC<LayoutProps> = ({ data, format, titleSize, subTitleSize, getProxyUrl }) => (
  <div className="absolute inset-0 grid grid-rows-2 z-30">
    {/* Top half badges overlay */}
    <div className="relative flex items-start justify-start p-8">
      <div className="flex gap-3 flex-wrap">
        {data.visibility?.ageGroup && data.ageGroup && (
          <div 
            className="px-5 py-2 rounded-full text-[22px] font-bold text-white shadow-lg"
            style={{ backgroundColor: data.ageGroupColor || '#FF8A65' }}
          >
            {data.ageGroup}
          </div>
        )}
        {data.visibility?.mealType && data.mealType && (
          <div className="bg-green-500 px-5 py-2 rounded-full text-[22px] font-bold text-white shadow-lg">
            {data.mealType}
          </div>
        )}
      </div>
    </div>
    
    {/* Bottom half content */}
    <div className="p-12 bg-gradient-to-b from-black/80 to-black flex flex-col justify-between">
      <div>
        <h1 className="text-[52px] font-bold mb-6 leading-tight">{data.title}</h1>
        
        {data.visibility?.ingredients && data.ingredients && data.ingredients.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[20px] uppercase text-gray-400 mb-3 font-bold">Malzemeler</h3>
            <ul className="grid grid-cols-2 gap-2 text-[22px]">
              {data.ingredients.slice(0, 6).map((ing, i) => (
                <li key={i} className="text-gray-200">• {ing}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {data.expert.isVisible && (
        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/20">
          {data.expert.avatarUrl ? (
            <img src={getProxyUrl(data.expert.avatarUrl)} alt={data.expert.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#FF7F3F]" />
          ) : (
            <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center">
              <User size={24} className="text-gray-400" />
            </div>
          )}
          <div>
            <p className="font-bold text-[24px]">{data.expert.name}</p>
            <p className="text-[16px] text-gray-400">{data.expert.title}</p>
          </div>
        </div>
      )}
    </div>
  </div>
);

// Featured Layout - Big bold title with featured image
export const FeaturedLayout: React.FC<LayoutProps> = ({ data, titleSize, subTitleSize }) => (
  <div className="absolute inset-0 p-16 flex flex-col justify-center items-center text-center z-30">
    <div className="bg-black/40 backdrop-blur-xl border border-white/20 p-12 rounded-[40px] shadow-2xl max-w-[90%]">
      <h1 className={`${titleSize} font-bold leading-[1.1] drop-shadow-xl mb-8`}>
        {data.title}
      </h1>
      {data.excerpt && (
        <p className={`${subTitleSize} text-gray-100 leading-relaxed max-w-[85%] mx-auto`}>
          {data.excerpt}
        </p>
      )}
      {data.expert.isVisible && data.expert.note && (
        <div className="mt-8 pt-8 border-t border-white/20">
          <p className="text-[24px] text-gray-200 italic">"{data.expert.note}"</p>
          <p className="text-[20px] text-[#FF7F3F] font-bold mt-4">— {data.expert.name}</p>
        </div>
      )}
    </div>
  </div>
);

// Info Layout - Information card style for ingredients/guides
export const InfoLayout: React.FC<LayoutProps> = ({ data, titleSize, subTitleSize }) => (
  <div className="absolute inset-0 p-16 flex flex-col justify-end z-30 pb-24">
    <div className="bg-blue-500/20 backdrop-blur-xl border-l-8 border-blue-500 p-10 rounded-2xl shadow-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
          <BookOpen size={32} className="text-white" />
        </div>
        <h1 className="text-[52px] font-bold leading-tight">{data.title}</h1>
      </div>
      {data.excerpt && (
        <p className="text-[26px] text-gray-100 leading-relaxed mt-4">
          {data.excerpt}
        </p>
      )}
      {data.benefits && (
        <div className="mt-6 pt-6 border-t border-white/20">
          <h3 className="text-[22px] uppercase text-blue-200 mb-2 font-bold">Faydaları</h3>
          <p className="text-[24px] text-gray-200">{data.benefits}</p>
        </div>
      )}
    </div>
  </div>
);

// Warning Layout - Alert/warning style for allergens
export const WarningLayout: React.FC<LayoutProps> = ({ data, titleSize }) => (
  <div className="absolute inset-0 p-16 flex flex-col justify-end z-30 pb-24">
    <div className="bg-red-500/20 backdrop-blur-xl border-l-8 border-red-500 p-10 rounded-2xl shadow-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
          <AlertTriangle size={32} className="text-white" />
        </div>
        <h1 className="text-[52px] font-bold leading-tight">{data.title}</h1>
      </div>
      
      {data.allergens && data.allergens.length > 0 && (
        <div className="mt-6">
          <h3 className="text-[22px] uppercase text-red-200 mb-3 font-bold">Alerjenler</h3>
          <div className="flex flex-wrap gap-3">
            {data.allergens.map((allergen, i) => (
              <span key={i} className="bg-red-500 text-white px-5 py-2 rounded-full text-[22px] font-bold">
                {allergen}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {data.allergyRisk && (
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-[24px] text-gray-200">
            <span className="font-bold text-red-300">Risk Seviyesi:</span> {data.allergyRisk}
          </p>
        </div>
      )}
    </div>
  </div>
);

// Quote Layout - Quote/excerpt focused
export const QuoteLayout: React.FC<LayoutProps> = ({ data, titleSize, subTitleSize }) => (
  <div className="absolute inset-0 p-16 flex items-center justify-center z-30">
    <div className="text-center max-w-[85%]">
      <div className="text-[120px] text-[#FF7F3F] font-serif leading-none mb-8">"</div>
      <h1 className={`${titleSize} font-bold leading-[1.2] mb-8`}>
        {data.title}
      </h1>
      {data.excerpt && (
        <p className={`${subTitleSize} text-gray-100 leading-relaxed italic`}>
          {data.excerpt}
        </p>
      )}
      {data.author.isVisible && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full"></div>
          <span className="text-[24px] font-bold">— {data.author.name}</span>
        </div>
      )}
    </div>
  </div>
);

// Simple Layout - Basic simple design
export const SimpleLayout: React.FC<LayoutProps> = ({ data, titleSize }) => (
  <div className="absolute inset-0 p-16 flex flex-col justify-end z-30 pb-24">
    <div className="space-y-6">
      <h1 className={`${titleSize} font-bold leading-[1.1] drop-shadow-xl`}>
        {data.title}
      </h1>
      {data.excerpt && (
        <p className="text-[28px] text-gray-100 leading-relaxed max-w-[90%]">
          {data.excerpt}
        </p>
      )}
    </div>
  </div>
);
