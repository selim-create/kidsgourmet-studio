import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TemplateData, SocialFormat } from '@/types';
import { DEFAULTS } from '@/lib/constants';

interface EditorState {
  // Template Data
  data: TemplateData;
  format: SocialFormat;
  
  // Actions
  setData: (data: Partial<TemplateData>) => void;
  setFormat: (format: SocialFormat) => void;
  setWatermark: (watermark: Partial<TemplateData['watermark']>) => void;
  resetData: () => void;
  loadFromPost: (data: TemplateData) => void;
}

const DEFAULT_DATA: TemplateData = {
  id: 'init',
  templateType: 'recipe',
  title: 'İçerik Başlığı',
  image: DEFAULTS.PLACEHOLDER_IMAGE,
  category: 'Kategori',
  ingredients: ['Malzeme 1', 'Malzeme 2'],
  excerpt: 'İçerik özeti buraya gelecek.',
  ageGroup: '',
  ageGroupColor: '',
  mealType: '',
  prepTime: '',
  season: '',
  allergens: [],
  allergyRisk: '',
  author: { 
    name: 'KidsGourmet', 
    avatarUrl: '', 
    isVisible: true 
  },
  expert: { 
    name: 'Dyt. Uzman Adı', 
    title: 'Beslenme Uzmanı', 
    avatarUrl: '',
    note: '',
    isVisible: true, 
    isVerified: true 
  },
  watermark: { 
    isVisible: true, 
    url: '', // Boş = varsayılan logo kullanılacak
    position: 'top-right', 
    opacity: 1, 
    scale: 1 
  },
  theme: 'modern'
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      data: DEFAULT_DATA,
      format: 'story',
      
      setData: (newData) => set((state) => ({
        data: { ...state.data, ...newData }
      })),
      
      setFormat: (format) => set({ format }),
      
      setWatermark: (watermark) => set((state) => ({
        data: {
          ...state.data,
          watermark: { ...state.data.watermark, ...watermark }
        }
      })),
      
      resetData: () => set({ data: DEFAULT_DATA }),
      
      loadFromPost: (data) => set((state) => ({
        data: { 
          ...data, 
          watermark: state.data.watermark // Watermark ayarlarını koru
        }
      })),
    }),
    {
      name: 'kg-studio-editor',
      partialize: (state) => ({ 
        format: state.format,
        watermark: state.data.watermark 
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<EditorState & { watermark: TemplateData['watermark'] }>;
        return {
          ...currentState,
          format: persisted.format || currentState.format,
          data: {
            ...currentState.data,
            watermark: persisted.watermark || currentState.data.watermark
          }
        };
      },
    }
  )
);
