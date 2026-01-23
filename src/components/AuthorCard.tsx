'use client';

import React from 'react';
import { User } from 'lucide-react';
import { AuthorCardProps } from '@/types';

const AuthorCard: React.FC<AuthorCardProps> = ({
  name,
  avatarUrl,
  isVisible,
  onToggleVisibility
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
          Yazar Bilgisi
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

      {/* Author Details */}
      {isVisible && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-4 bg-white/5 rounded-lg p-3">
            {avatarUrl ? (
              <img 
                src={getProxyUrl(avatarUrl)} 
                alt={name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border-2 border-gray-600">
                <User size={24} className="text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Yazar Adı" 
                value={name} 
                readOnly
                className="modern-input text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorCard;
