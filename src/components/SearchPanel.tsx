'use client';

import React, { useState } from 'react';
import { Search, Loader2, FileText, ChefHat, BookOpen, Link2, Hash, Layers } from 'lucide-react';
import { searchContent, getPostByUrl, getPostById } from '@/services/api';
import { WpPost } from '@/types';

interface SearchPanelProps {
  onSelect: (post: WpPost) => void;
}

type SearchTab = 'all' | 'recipes' | 'posts' | 'ingredients';
type InputMode = 'search' | 'url' | 'id';

interface GroupedResults {
  recipes: WpPost[];
  ingredients: WpPost[];
  posts: WpPost[];
}

export default function SearchPanel({ onSelect }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WpPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [inputMode, setInputMode] = useState<InputMode>('search');
  const [error, setError] = useState('');
  const [idPostType, setIdPostType] = useState<'recipes' | 'posts' | 'ingredients'>('recipes');

  // Sonuçları post type'a göre grupla
  const groupedResults: GroupedResults = {
    recipes: results.filter(p => p.type === 'recipes' || p.type === 'recipe'),
    ingredients: results.filter(p => p.type === 'ingredients' || p.type === 'ingredient'),
    posts: results.filter(p => p.type === 'post' || p.type === 'posts'),
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      if (inputMode === 'url') {
        // URL ile yükleme
        const post = await getPostByUrl(query);
        if (post) {
          onSelect(post);
          setQuery('');
        } else {
          setError('URL geçersiz veya içerik bulunamadı');
        }
      } else if (inputMode === 'id') {
        // ID ile yükleme
        const id = parseInt(query);
        if (isNaN(id)) {
          setError('Geçerli bir ID numarası girin');
        } else {
          const post = await getPostById(id, idPostType);
          if (post) {
            onSelect(post);
            setQuery('');
          } else {
            setError('Bu ID ile içerik bulunamadı');
          }
        }
      } else {
        // Normal arama
        const data = await searchContent(query, activeTab);
        setResults(data);
        if (data.length === 0) {
          setError('Sonuç bulunamadı');
        }
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 bg-[#252525] p-4 rounded-xl border border-gray-800 space-y-3">
      
      {/* Input Mode Seçici */}
      <div className="flex gap-2">
        <button
          onClick={() => { setInputMode('search'); setError(''); setResults([]); }}
          className={`flex-1 text-xs py-2 rounded flex items-center justify-center gap-1.5 transition-colors ${inputMode === 'search' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
        >
          <Search size={12} /> Arama
        </button>
        <button
          onClick={() => { setInputMode('url'); setError(''); setResults([]); }}
          className={`flex-1 text-xs py-2 rounded flex items-center justify-center gap-1.5 transition-colors ${inputMode === 'url' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
        >
          <Link2 size={12} /> Link
        </button>
        <button
          onClick={() => { setInputMode('id'); setError(''); setResults([]); }}
          className={`flex-1 text-xs py-2 rounded flex items-center justify-center gap-1.5 transition-colors ${inputMode === 'id' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
        >
          <Hash size={12} /> ID
        </button>
      </div>

      {/* Arama modunda Tab Seçimi */}
      {inputMode === 'search' && (
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 text-xs py-1.5 rounded flex items-center justify-center gap-1 transition-colors ${activeTab === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            <Layers size={12} /> Tümü
          </button>
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
      )}

      {/* ID modu için post type seçimi */}
      {inputMode === 'id' && (
        <div className="flex gap-2">
          <button
            onClick={() => setIdPostType('recipes')}
            className={`flex-1 text-xs py-1.5 rounded flex items-center justify-center gap-1 transition-colors ${idPostType === 'recipes' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            <ChefHat size={12} /> Tarif
          </button>
          <button
            onClick={() => setIdPostType('ingredients')}
            className={`flex-1 text-xs py-1.5 rounded flex items-center justify-center gap-1 transition-colors ${idPostType === 'ingredients' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            <BookOpen size={12} /> Rehber
          </button>
          <button
            onClick={() => setIdPostType('posts')}
            className={`flex-1 text-xs py-1.5 rounded flex items-center justify-center gap-1 transition-colors ${idPostType === 'posts' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            <FileText size={12} /> Yazı
          </button>
        </div>
      )}

      {/* Arama Input */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setError(''); }}
          placeholder={
            inputMode === 'url' 
              ? "https://kidsgourmet.com.tr/tarifler/..." 
              : inputMode === 'id'
              ? "Örn: 123"
              : activeTab === 'all' 
              ? "Tüm içeriklerde ara..." 
              : activeTab === 'recipes' 
              ? "Örn: Avokadolu..." 
              : activeTab === 'ingredients' 
              ? "Örn: Brokoli..." 
              : "Örn: Ek Gıda..."
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

      {/* Hata Mesajı */}
      {error && (
        <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Sonuç Listesi */}
      {results.length > 0 && inputMode === 'search' && (
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-4">
          
          {/* Toplu arama sonuçları gruplandırılmış */}
          {activeTab === 'all' ? (
            <>
              {groupedResults.recipes.length > 0 && (
                <ResultGroup 
                  title="Tarifler" 
                  icon={<ChefHat size={14} />} 
                  results={groupedResults.recipes} 
                  onSelect={onSelect}
                  color="orange"
                />
              )}
              {groupedResults.ingredients.length > 0 && (
                <ResultGroup 
                  title="Malzemeler" 
                  icon={<BookOpen size={14} />} 
                  results={groupedResults.ingredients} 
                  onSelect={onSelect}
                  color="green"
                />
              )}
              {groupedResults.posts.length > 0 && (
                <ResultGroup 
                  title="Yazılar" 
                  icon={<FileText size={14} />} 
                  results={groupedResults.posts} 
                  onSelect={onSelect}
                  color="blue"
                />
              )}
            </>
          ) : (
            <div className="space-y-2">
              {results.map((post) => (
                <ResultItem key={post.id} post={post} onSelect={onSelect} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Alt bileşen: Grup başlığı ile sonuçları göster
function ResultGroup({ 
  title, 
  icon, 
  results, 
  onSelect, 
  color 
}: { 
  title: string; 
  icon: React.ReactNode; 
  results: WpPost[]; 
  onSelect: (post: WpPost) => void;
  color: 'orange' | 'green' | 'blue';
}) {
  const colorClasses = {
    orange: 'text-orange-400 border-orange-500/30 bg-orange-500/5',
    green: 'text-green-400 border-green-500/30 bg-green-500/5',
    blue: 'text-blue-400 border-blue-500/30 bg-blue-500/5',
  };

  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-2 text-xs font-bold px-2 py-1 rounded border ${colorClasses[color]}`}>
        {icon}
        <span>{title}</span>
        <span className="ml-auto text-[10px] opacity-70">({results.length})</span>
      </div>
      <div className="space-y-2">
        {results.map((post) => (
          <ResultItem key={post.id} post={post} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

// Alt bileşen: Tek bir sonuç öğesi
function ResultItem({ post, onSelect }: { post: WpPost; onSelect: (post: WpPost) => void }) {
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <div 
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
}