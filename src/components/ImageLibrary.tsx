'use client';

import React, { useState } from 'react';
import { Search, Loader2, ImagePlus, ExternalLink } from 'lucide-react';
import { StockImage, ImageLibrarySource } from '@/types';
import { searchStockImages } from '@/services/stockImages';

interface ImageLibraryProps {
  onSelect: (image: StockImage) => void;
  defaultQuery?: string;
}

export default function ImageLibrary({ onSelect, defaultQuery = '' }: ImageLibraryProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [source, setSource] = useState<ImageLibrarySource>('all');
  const [results, setResults] = useState<StockImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    // Manually trigger search with nextPage to avoid stale state
    handleSearchWithPage(nextPage);
  };

  const handleSearchWithPage = async (currentPage: number) => {
    if (!query.trim()) {
      setError('Lütfen bir arama terimi girin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const images = await searchStockImages(query, source, currentPage);
      
      if (images.length === 0 && currentPage === 1) {
        setError('Sonuç bulunamadı. Farklı bir arama deneyin.');
        setResults([]);
        setHasMore(false);
      } else {
        setResults(prev => currentPage === 1 ? images : [...prev, ...images]);
        setHasMore(images.length > 0);
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Image search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setPage(1);
    handleSearchWithPage(1);
  };

  const handleImageSelect = (image: StockImage) => {
    onSelect(image);
  };

  return (
    <div className="space-y-4">
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-3">
        
        {/* Source Selection */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setSource('all'); setResults([]); setError(''); }}
            className={`flex-1 text-xs py-2 rounded transition-colors ${
              source === 'all' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Tümü
          </button>
          <button
            type="button"
            onClick={() => { setSource('pexels'); setResults([]); setError(''); }}
            className={`flex-1 text-xs py-2 rounded transition-colors ${
              source === 'pexels' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Pexels
          </button>
          <button
            type="button"
            onClick={() => { setSource('unsplash'); setResults([]); setError(''); }}
            className={`flex-1 text-xs py-2 rounded transition-colors ${
              source === 'unsplash' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Unsplash
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setError(''); }}
            placeholder="Örn: healthy food, vegetables, fruits..."
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm text-white focus:border-orange-500 outline-none placeholder-gray-600"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="absolute right-2 top-2 text-gray-400 hover:text-white disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Results Grid */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto custom-scrollbar">
            {results.map((image) => (
              <ImageCard 
                key={image.id} 
                image={image} 
                onSelect={handleImageSelect}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && !loading && (
            <button
              onClick={handleLoadMore}
              className="w-full py-2 px-4 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-orange-500 rounded-lg text-sm text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <ImagePlus size={16} />
              Daha Fazla Yükle
            </button>
          )}

          {/* Loading State for Load More */}
          {loading && page > 1 && (
            <div className="text-center py-4">
              <Loader2 size={20} className="animate-spin inline-block text-orange-500" />
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && !loading && !error && (
        <div className="text-center py-12 text-gray-500">
          <ImagePlus size={48} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">Görsel aramak için yukarıdaki alana anahtar kelime girin</p>
        </div>
      )}
    </div>
  );
}

// Image Card Component
function ImageCard({ 
  image, 
  onSelect 
}: { 
  image: StockImage; 
  onSelect: (image: StockImage) => void;
}) {
  return (
    <div
      onClick={() => onSelect(image)}
      className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-transparent hover:border-orange-500 transition-all bg-gray-800"
    >
      {/* Image */}
      <img
        src={image.thumbnailUrl}
        alt={image.alt}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23333"/><text x="50%" y="50%" text-anchor="middle" fill="%23666" font-size="14">Image Error</text></svg>';
        }}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />

      {/* Overlay with Photographer Info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
        <p className="text-[10px] text-white/90 flex items-center gap-1">
          <span className="truncate">{image.photographer}</span>
          <ExternalLink size={10} className="flex-shrink-0" />
        </p>
        <p className="text-[9px] text-white/60 uppercase">{image.source}</p>
      </div>

      {/* Source Badge */}
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[9px] text-white/80 uppercase font-medium">
        {image.source}
      </div>
    </div>
  );
}
