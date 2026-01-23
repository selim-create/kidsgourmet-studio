'use client';

import React from 'react';
import { X } from 'lucide-react';
import SocialCard from './SocialCard';
import { TemplateData, SocialFormat, TemplateLayout } from '@/types';

interface MobilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  format: SocialFormat;
  data: TemplateData;
  defaultWatermarkUrl: string;
  layout: TemplateLayout;
}

export default function MobilePreview({ isOpen, onClose, format, data, defaultWatermarkUrl, layout }: MobilePreviewProps) {
  if (!isOpen) return null;

  const isStory = format === 'story';
  const dimensions = isStory 
    ? { width: '1080px', height: '1920px' }
    : { width: '1080px', height: '1080px' };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-[95vw] max-h-[95vh]">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 bg-[#FF7F3F] hover:bg-[#FF5722] text-white rounded-full p-2 shadow-lg transition-colors"
        >
          <X size={24} />
        </button>

        {/* iPhone Mockup */}
        <div className="relative bg-[#1E1E1E] rounded-[3rem] p-4 shadow-2xl border-8 border-[#2A2A2A]">
          {/* iPhone Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#1E1E1E] rounded-b-3xl z-20" />
          
          {/* Status Bar */}
          <div className="absolute top-8 left-0 right-0 z-20 px-8 flex justify-between items-center text-white text-xs">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-bold">100%</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Screen Content */}
          <div className="bg-black rounded-[2.5rem] overflow-hidden relative" style={{ height: '650px' }}>
            {isStory && (
              <>
                {/* Instagram Story Header */}
                <div className="absolute top-0 left-0 right-0 z-30 p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7F3F] to-[#FF5722] flex items-center justify-center text-white font-bold text-xs">
                    KG
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-semibold drop-shadow-lg">kidsgourmet</div>
                    <div className="text-white/80 text-xs drop-shadow-lg">2s</div>
                  </div>
                  <button className="text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>

                {/* Story Progress Bar */}
                <div className="absolute top-2 left-0 right-0 z-30 px-2">
                  <div className="h-0.5 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full w-3/5 bg-white rounded-full" />
                  </div>
                </div>

                {/* Story Bottom Bar */}
                <div className="absolute bottom-0 left-0 right-0 z-30 p-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-3 flex items-center gap-2 border border-white/20">
                    <input 
                      type="text" 
                      placeholder="Mesaj gönder..." 
                      className="flex-1 bg-transparent text-white placeholder-white/60 text-sm outline-none"
                      readOnly
                    />
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </div>
                </div>
              </>
            )}

            {/* Preview Card */}
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <div className="transform scale-[0.3] origin-center">
                <SocialCard format={format} data={data} defaultWatermarkUrl={defaultWatermarkUrl} layout={layout} />
              </div>
            </div>
          </div>

          {/* iPhone Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/20 rounded-full" />
        </div>

        {/* Info Badge */}
        <div className="absolute -bottom-12 left-0 right-0 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1E1E1E] text-white px-4 py-2 rounded-full text-xs border border-white/10">
            <span className="text-[#FF7F3F] font-bold">📱</span>
            <span>{isStory ? 'Instagram Story' : 'Instagram Post'} • {dimensions.width} × {dimensions.height}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
