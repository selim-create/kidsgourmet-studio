// Theme presets for KidsGourmet Studio

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'kidsgourmet',
    name: 'KidsGourmet',
    description: 'Varsayılan turuncu tema',
    colors: {
      primary: '#FF7F3F',
      secondary: '#FF5722',
      accent: '#FFB74D',
      background: '#1E1E1E',
      text: '#FFFFFF',
    },
  },
  {
    id: 'ramazan',
    name: 'Ramazan',
    description: 'Mor tema',
    colors: {
      primary: '#9C27B0',
      secondary: '#7B1FA2',
      accent: '#BA68C8',
      background: '#1A1A2E',
      text: '#FFFFFF',
    },
  },
  {
    id: 'summer',
    name: 'Yaz',
    description: 'Sarı-yeşil tema',
    colors: {
      primary: '#FDD835',
      secondary: '#66BB6A',
      accent: '#FFEB3B',
      background: '#1B5E20',
      text: '#FFFFFF',
    },
  },
  {
    id: 'winter',
    name: 'Kış',
    description: 'Mavi tema',
    colors: {
      primary: '#2196F3',
      secondary: '#1976D2',
      accent: '#64B5F6',
      background: '#0D47A1',
      text: '#FFFFFF',
    },
  },
  {
    id: 'back-to-school',
    name: 'Okula Dönüş',
    description: 'Yeşil-sarı tema',
    colors: {
      primary: '#8BC34A',
      secondary: '#FFC107',
      accent: '#CDDC39',
      background: '#33691E',
      text: '#FFFFFF',
    },
  },
  {
    id: 'pastel',
    name: 'Pastel',
    description: 'Pembe tema',
    colors: {
      primary: '#F48FB1',
      secondary: '#EC407A',
      accent: '#FCE4EC',
      background: '#880E4F',
      text: '#FFFFFF',
    },
  },
];

// Caption templates and hashtags
export const CAPTION_TEMPLATES = {
  recipe: [
    '🍽️ {title} tarifimizi denemeye hazır mısınız?\n\n{excerpt}\n\n',
    '👶 Bebeğiniz için özel {title} tarifi!\n\n{excerpt}\n\n',
    '💚 Sağlıklı ve lezzetli: {title}\n\n{excerpt}\n\n',
  ],
  blog: [
    '📝 {title}\n\n{excerpt}\n\n',
    '💡 İpucu: {title}\n\n{excerpt}\n\n',
    '🌟 {title} hakkında bilmeniz gerekenler!\n\n{excerpt}\n\n',
  ],
  guide: [
    '📖 Rehber: {title}\n\n{excerpt}\n\n',
    '🎯 {title} - Detaylı rehber\n\n{excerpt}\n\n',
    '✨ {title} için kapsamlı kılavuz\n\n{excerpt}\n\n',
  ],
};

export const HASHTAG_POOL = [
  // Genel
  '#bebekyemekleri',
  '#cocukyemekleri',
  '#sagliklibeslenme',
  '#cocuktarifleri',
  '#bebekyemegi',
  '#annecocuk',
  '#bebektarifleri',
  
  // Yaş grupları
  '#6ay',
  '#9ay',
  '#1yas',
  '#2yas',
  '#cocuk',
  
  // Özel
  '#organik',
  '#evyapimi',
  '#saglikli',
  '#dogal',
  '#katkisiz',
  '#tatli',
  '#kahvalti',
  '#ogle',
  '#aksam',
  '#atistirma',
  
  // KidsGourmet
  '#kidsgourmet',
  '#kidsgourmetstudio',
  '#turkiyedebebekler',
  '#anneblogger',
  '#mamablogu',
];
