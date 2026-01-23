import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatermarkPreset {
  id: string;
  name: string;
  url: string;
}

interface SettingsState {
  // Watermark
  defaultWatermarkUrl: string;
  watermarkPresets: WatermarkPreset[];
  
  // Theme
  theme: 'dark' | 'light';
  
  // Favorites
  favoriteTemplates: string[];
  
  // Actions
  setDefaultWatermark: (url: string) => void;
  addWatermarkPreset: (preset: WatermarkPreset) => void;
  removeWatermarkPreset: (id: string) => void;
  toggleTheme: () => void;
  toggleFavoriteTemplate: (templateId: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      defaultWatermarkUrl: '',
      watermarkPresets: [],
      theme: 'dark',
      favoriteTemplates: [],
      
      setDefaultWatermark: (url) => set({ defaultWatermarkUrl: url }),
      
      addWatermarkPreset: (preset) => set((state) => ({
        watermarkPresets: [...state.watermarkPresets, preset]
      })),
      
      removeWatermarkPreset: (id) => set((state) => ({
        watermarkPresets: state.watermarkPresets.filter(p => p.id !== id)
      })),
      
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'dark' ? 'light' : 'dark'
      })),
      
      toggleFavoriteTemplate: (templateId) => set((state) => ({
        favoriteTemplates: state.favoriteTemplates.includes(templateId)
          ? state.favoriteTemplates.filter(id => id !== templateId)
          : [...state.favoriteTemplates, templateId]
      })),
    }),
    {
      name: 'kg-studio-settings',
    }
  )
);
