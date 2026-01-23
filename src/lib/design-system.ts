// KidsGourmet Design Tokens - kidsgourmet-web'den alındı

export const colors = {
  brand: {
    primary: '#FF8A65',    // Ana Turuncu
    secondary: '#AED581',  // Pastel Yeşil
    blue: '#81D4FA',       // Bebek Mavisi
    yellow: '#FFF176',     // Pastel Sarı
    dark: '#455A64',       // Metin Rengi
    light: '#FFFBE6',      // Krem Arkaplan
    purple: '#B39DDB',     // Mor (Kategori)
  },
  
  // Yaş Grubu Renkleri
  ageGroup: {
    '6-9 Ay': '#FF8A65',
    '9-12 Ay': '#AED581',
    '12+ Ay': '#81D4FA',
    '1-2 Yaş': '#FFF176',
    '2+ Yaş': '#B39DDB',
  },
  
  // Alerji Risk Renkleri
  allergyRisk: {
    'Düşük': '#4CAF50',
    'Orta': '#FFC107',
    'Yüksek': '#F44336',
  },
  
  // Mevsim Renkleri
  season: {
    'İlkbahar': '#E91E63',
    'Yaz': '#FF9800',
    'Sonbahar': '#795548',
    'Kış': '#2196F3',
    'Tüm Yıl': '#4CAF50',
  },
  
  // UI Renkleri
  ui: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceHover: '#252525',
    border: 'rgba(255, 255, 255, 0.1)',
    text: {
      primary: '#FFFFFF',
      secondary: '#9CA3AF',
      muted: '#6B7280',
    }
  }
};

export const fonts = {
  display: "'Quicksand', sans-serif",
  body: "'Inter', 'Outfit', sans-serif",
};

export const spacing = {
  card: {
    padding: '16px',
    gap: '12px',
  },
  badge: {
    paddingX: '24px',
    paddingY: '12px',
  }
};

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
};

export const shadows = {
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  badge: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
  glow: '0 0 20px rgba(255, 127, 63, 0.3)',
};

// Mevsim İkonları
export const seasonIcons: Record<string, string> = {
  'İlkbahar': '🌸',
  'Yaz': '☀️',
  'Sonbahar': '🍂',
  'Kış': '❄️',
  'Tüm Yıl': '🌍',
};

// Yardımcı Fonksiyonlar
export const getAgeGroupColor = (ageGroup: string): string => {
  return colors.ageGroup[ageGroup as keyof typeof colors.ageGroup] || colors.brand.primary;
};

export const getAllergyRiskColor = (risk: string): string => {
  return colors.allergyRisk[risk as keyof typeof colors.allergyRisk] || colors.allergyRisk['Düşük'];
};

export const getSeasonIcon = (season: string): string => {
  return seasonIcons[season] || '🌍';
};

export const getSeasonColor = (season: string): string => {
  return colors.season[season as keyof typeof colors.season] || colors.brand.secondary;
};
