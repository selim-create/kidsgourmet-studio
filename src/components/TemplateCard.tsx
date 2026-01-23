'use client';

import React from 'react';
import { Instagram, ImageIcon, ChefHat, FileText, BookOpen } from 'lucide-react';
import { TemplateCardProps } from '@/types';

const TemplateCard: React.FC<TemplateCardProps> = ({
  name,
  description,
  previewImage,
  templateType,
  format,
  tags,
  onSelect
}) => {
  
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
      className="group relative bg-[#1E1E1E] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#FF7F3F]/50 cursor-pointer"
      onClick={onSelect}
    >
      {/* Preview Image */}
      <div className="aspect-[9/16] bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
        {previewImage && previewImage.startsWith('/templates/') ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20">{getTypeIcon()}</div>
          </div>
        ) : (
          <img 
            src={previewImage} 
            alt={name}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-[#FF7F3F] text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Şablonu Seç
          </button>
        </div>

        {/* Format Badge */}
        <div className="absolute top-3 right-3">
          {getFormatBadge()}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg leading-tight mb-1">{name}</h3>
            <p className="text-gray-400 text-sm leading-snug">{description}</p>
          </div>
          <div className="text-[#FF7F3F] shrink-0">
            {getTypeIcon()}
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="bg-white/5 text-gray-400 px-2 py-1 rounded text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;
