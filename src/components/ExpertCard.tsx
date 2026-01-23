'use client';

import React from 'react';
import { User, CheckCircle2 } from 'lucide-react';
import { ExpertCardProps } from '@/types';

const ExpertCard: React.FC<ExpertCardProps> = ({
  name,
  title,
  avatarUrl,
  note,
  isVerified = false,
  isVisible,
  onToggleVisibility,
  variant = 'full'
}) => {
  
  const getProxyUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) return url;
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  };

  return (
    <div className="space-y-3">
      {/* Toggle Header */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
          <User size={14} />
          Uzman Kartı
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={isVisible} 
            onChange={() => onToggleVisibility()}
          />
          <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF7F3F]"></div>
        </label>
      </div>

      {/* Expert Details */}
      {isVisible && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
          {variant === 'full' ? (
            <>
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  {avatarUrl ? (
                    <img 
                      src={getProxyUrl(avatarUrl)} 
                      alt={name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#FF7F3F]"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border-2 border-gray-600">
                      <User size={28} className="text-gray-400" />
                    </div>
                  )}
                  {isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                      <CheckCircle2 size={16} className="text-white fill-blue-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Ad Soyad" 
                    value={name} 
                    readOnly
                    className="modern-input text-sm mb-2"
                  />
                  <input 
                    type="text" 
                    placeholder="Ünvan" 
                    value={title} 
                    readOnly
                    className="modern-input text-sm"
                  />
                </div>
              </div>

              {/* Expert Note */}
              {note && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">
                    Uzman Notu
                  </label>
                  <p className="text-sm text-gray-300 italic leading-relaxed">
                    &quot;{note}&quot;
                  </p>
                </div>
              )}

              {/* Verified Badge Toggle */}
              <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-blue-400" />
                  <span className="text-sm text-gray-300">Onaylı Uzman</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isVerified}
                    readOnly
                  />
                  <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            </>
          ) : (
            // Compact Variant
            <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
              {avatarUrl ? (
                <img 
                  src={getProxyUrl(avatarUrl)} 
                  alt={name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#FF7F3F]"
                />
              ) : (
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">{name}</p>
                  {isVerified && <CheckCircle2 size={14} className="text-blue-400" />}
                </div>
                <p className="text-xs text-gray-400">{title}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpertCard;
