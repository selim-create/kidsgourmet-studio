import { StockImage, ImageLibrarySource } from '@/types';
import { STOCK_IMAGE_CONFIG } from '@/lib/constants';

// API Keys from environment variables
const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY || '';
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';

// Pexels API Response Types
interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
}

// Unsplash API Response Types
interface UnsplashPhoto {
  id: string;
  width: number;
  height: number;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  alt_description: string | null;
  description: string | null;
}

interface UnsplashResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

/**
 * Search images from Pexels API
 */
export const searchPexelsImages = async (
  query: string,
  page: number = 1,
  perPage: number = STOCK_IMAGE_CONFIG.PEXELS.PER_PAGE
): Promise<StockImage[]> => {
  if (!PEXELS_API_KEY) {
    console.warn('Pexels API key not configured');
    return [];
  }

  try {
    const url = `${STOCK_IMAGE_CONFIG.PEXELS.BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data: PexelsResponse = await response.json();

    return data.photos.map((photo): StockImage => ({
      id: `pexels-${photo.id}`,
      url: photo.src.large,
      thumbnailUrl: photo.src.medium,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      source: 'pexels',
      width: photo.width,
      height: photo.height,
      alt: photo.alt || query,
    }));
  } catch (error) {
    console.error('Error fetching from Pexels:', error);
    return [];
  }
};

/**
 * Search images from Unsplash API
 */
export const searchUnsplashImages = async (
  query: string,
  page: number = 1,
  perPage: number = STOCK_IMAGE_CONFIG.UNSPLASH.PER_PAGE
): Promise<StockImage[]> => {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not configured');
    return [];
  }

  try {
    const url = `${STOCK_IMAGE_CONFIG.UNSPLASH.BASE_URL}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data: UnsplashResponse = await response.json();

    return data.results.map((photo): StockImage => ({
      id: `unsplash-${photo.id}`,
      url: photo.urls.regular,
      thumbnailUrl: photo.urls.small,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      source: 'unsplash',
      width: photo.width,
      height: photo.height,
      alt: photo.alt_description || photo.description || query,
    }));
  } catch (error) {
    console.error('Error fetching from Unsplash:', error);
    return [];
  }
};

/**
 * Search images from all sources or specific source
 */
export const searchStockImages = async (
  query: string,
  source: ImageLibrarySource = 'all',
  page: number = 1
): Promise<StockImage[]> => {
  if (!query.trim()) {
    return [];
  }

  if (source === 'pexels') {
    return searchPexelsImages(query, page);
  }

  if (source === 'unsplash') {
    return searchUnsplashImages(query, page);
  }

  // Search both sources and merge results
  const [pexelsResults, unsplashResults] = await Promise.all([
    searchPexelsImages(query, page),
    searchUnsplashImages(query, page),
  ]);

  // Interleave results for better variety
  const merged: StockImage[] = [];
  const maxLength = Math.max(pexelsResults.length, unsplashResults.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i < pexelsResults.length) {
      merged.push(pexelsResults[i]);
    }
    if (i < unsplashResults.length) {
      merged.push(unsplashResults[i]);
    }
  }

  return merged;
};
