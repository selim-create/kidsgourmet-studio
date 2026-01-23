'use client';

import React from 'react';
import { X, Check } from 'lucide-react';
import { THEME_PRESETS, ThemePreset } from '@/lib/presets';

interface PresetSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: string;
  onThemeSelect: (preset: ThemePreset) => void;
}

export default function PresetSelector({ isOpen, onClose, currentTheme, onThemeSelect }: PresetSelectorProps) {
  if (!isOpen) return null;

  const handleSelect = (preset: ThemePreset) => {
    onThemeSelect(preset);
    // Don't close immediately - let user select multiple times
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E1E1E] rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            Tema Şablonları
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelect(preset)}
              className={`group relative bg-white/5 hover:bg-white/10 rounded-xl p-4 border-2 transition-all ${
                currentTheme === preset.id 
                  ? 'border-[#FF7F3F]' 
                  : 'border-transparent hover:border-white/20'
              }`}
            >
              {/* Selected Indicator */}
              {currentTheme === preset.id && (
                <div className="absolute top-2 right-2 bg-[#FF7F3F] text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}

              {/* Theme Name */}
              <h3 className="text-white font-bold text-lg mb-2">{preset.name}</h3>
              <p className="text-gray-400 text-xs mb-4">{preset.description}</p>

              {/* Color Palette */}
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <div 
                    className="w-8 h-8 rounded-lg shadow-md"
                    style={{ backgroundColor: preset.colors.primary }}
                  />
                  <div className="text-left flex-1">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Ana Renk</div>
                    <div className="text-xs text-gray-400 font-mono">{preset.colors.primary}</div>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <div 
                    className="w-8 h-8 rounded-lg shadow-md"
                    style={{ backgroundColor: preset.colors.secondary }}
                  />
                  <div className="text-left flex-1">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">İkincil Renk</div>
                    <div className="text-xs text-gray-400 font-mono">{preset.colors.secondary}</div>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <div 
                    className="w-8 h-8 rounded-lg shadow-md"
                    style={{ backgroundColor: preset.colors.accent }}
                  />
                  <div className="text-left flex-1">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Vurgu Rengi</div>
                    <div className="text-xs text-gray-400 font-mono">{preset.colors.accent}</div>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-transparent group-hover:from-white/5 group-hover:to-transparent pointer-events-none transition-all" />
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="bg-white/5 rounded-lg p-3 text-xs text-gray-400">
          💡 Tema seçimi şu anda görsel önizleme amaçlıdır. Tam entegrasyon için SocialCard bileşeninde tema desteği eklenmelidir.
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 bg-gradient-to-r from-[#FF7F3F] to-[#FF5722] hover:from-[#FF8A65] hover:to-[#FF7043] text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all active:scale-[0.98]"
        >
          KAPAT
        </button>
      </div>
    </div>
  );
}
