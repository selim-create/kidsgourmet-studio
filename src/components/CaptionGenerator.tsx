'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Copy, RefreshCw, Check } from 'lucide-react';
import { CAPTION_TEMPLATES, HASHTAG_POOL } from '@/lib/presets';
import { TemplateType } from '@/types';

interface CaptionGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  templateType: TemplateType;
  title: string;
  excerpt?: string;
}

export default function CaptionGenerator({ isOpen, onClose, templateType, title, excerpt }: CaptionGeneratorProps) {
  const [caption, setCaption] = useState('');
  const [hashtagCount, setHashtagCount] = useState(10);
  const [copied, setCopied] = useState(false);

  const generateCaption = useCallback(() => {
    // Get random template for the content type
    const templates = CAPTION_TEMPLATES[templateType];
    if (!templates || templates.length === 0) {
      setCaption('Varsayılan caption metni buraya gelecek.');
      return;
    }
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // Replace placeholders
    let captionText = randomTemplate
      .replace('{title}', title || 'Tarifimiz')
      .replace('{excerpt}', excerpt || 'Detaylar için takipte kalın!');

    // Generate random hashtags
    const shuffled = [...HASHTAG_POOL].sort(() => Math.random() - 0.5);
    const selectedHashtags = shuffled.slice(0, hashtagCount);
    
    captionText += selectedHashtags.join(' ');
    
    setCaption(captionText);
  }, [templateType, title, excerpt, hashtagCount]);

  useEffect(() => {
    if (isOpen) {
      generateCaption();
    }
  }, [isOpen, generateCaption]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Kopyalama başarısız oldu');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E1E1E] rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">✍️</span>
            Caption Oluşturucu
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Hashtag Count Slider */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Hashtag Sayısı
            </label>
            <span className="text-xs text-gray-400">
              {hashtagCount} adet
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="20"
            step="1"
            value={hashtagCount}
            onChange={(e) => setHashtagCount(parseInt(e.target.value))}
            className="w-full accent-[#FF7F3F] h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Caption Preview */}
        <div className="mb-6">
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
            Oluşturulan Caption
          </label>
          <div className="bg-[#0F0F0F] rounded-xl p-4 border border-white/5 min-h-[200px]">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
              {caption}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={generateCaption}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw size={18} />
            Yeniden Oluştur
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 bg-gradient-to-r from-[#FF7F3F] to-[#FF5722] hover:from-[#FF8A65] hover:to-[#FF7043] text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check size={18} />
                KOPYALANDI
              </>
            ) : (
              <>
                <Copy size={18} />
                KOPYALA
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 bg-white/5 rounded-lg p-3 text-xs text-gray-400">
          💡 Her tıklamada farklı bir caption ve rastgele hashtag kombinasyonu oluşturulur
        </div>
      </div>
    </div>
  );
}
