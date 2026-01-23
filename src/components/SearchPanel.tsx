'use client';

import React, { useState } from 'react';
import { Search, Loader2, FileText, ChefHat, BookOpen } from 'lucide-react';
import { searchContent } from '@/services/api';
import { WpPost } from '@/types';

interface SearchPanelProps {
  onSelect: (post: WpPost) => void;
}

export default function SearchPanel({ onSelect }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WpPost[]>([]);
  const [loading, setLoading] = useState(false);
  // Yeni tab 'ingredients' eklendi
  const [activeTab, setActiveTab] = useState<'recipes' | 'posts' | 'ingredients'>('recipes');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    // searchContent artık ingredients tipini de destekliyor
    const data = await searchContent(query, activeTab);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="mb-6 bg-[#252525] p-4 rounded-xl border border-gray-800">
      
      {/* Tab Seçimi */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setActiveTab('recipes')}
          className={`flex-1 text-xs py-1.5 rounded flex items-center justify-center gap-1 transition-colors ${activeTab === 'recipes' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
        >
          <ChefHat size={12} /> Tarif
        </button>
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`flex-1 text-xs py-1.5 rounded flex items-center justify-center gap-1 transition-colors ${activeTab === 'ingredients' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
        >
          <BookOpen size={12} /> Rehber
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 text-xs py-1.5 rounded flex items-center justify-center gap-1 transition-colors ${activeTab === 'posts' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
        >
          <FileText size={12} /> Yazı
        </button>
      </div>

      {/* Arama Input */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            activeTab === 'recipes' ? "Örn: Avokadolu..." : 
            activeTab === 'ingredients' ? "Örn: Brokoli..." :
            "Örn: Ek Gıda..."
          }
          className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm text-white focus:border-orange-500 outline-none placeholder-gray-600"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="absolute right-2 top-2 text-gray-400 hover:text-white"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        </button>
      </form>

      {/* Sonuç Listesi */}
      {results.length > 0 && (
        <div className="mt-3 max-h-48 overflow-y-auto custom-scrollbar space-y-2">
          {results.map((post) => {
            // Görsel Kontrolü (Daha Güvenli):
            const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

            return (
              <div 
                key={post.id}
                onClick={() => onSelect(post)}
                className="group flex gap-3 p-2 hover:bg-[#333] rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-700"
              >
                {/* Küçük Resim */}
                <div className="w-10 h-10 rounded bg-gray-800 shrink-0 overflow-hidden relative">
                  {featuredImage ? (
                    <img 
                      src={featuredImage} 
                      className="w-full h-full object-cover" 
                      alt="Thumbnail"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-[8px] bg-gray-800">YOK</div>
                  )}
                </div>
                
                {/* Başlık */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-200 font-medium truncate group-hover:text-orange-400" 
                     dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  <p className="text-[10px] text-gray-500 mt-0.5">
                     {new Date(post.date).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}