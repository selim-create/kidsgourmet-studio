'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, FileText, Filter, Instagram, ImageIcon } from 'lucide-react';
import TemplateCard from '@/components/TemplateCard';
import { BLOG_TEMPLATES } from '@/lib/templates';
import { SocialFormat } from '@/types';

export default function BlogTemplatesPage() {
  const router = useRouter();
  const [formatFilter, setFormatFilter] = useState<SocialFormat | 'all'>('all');

  const filteredTemplates = BLOG_TEMPLATES.filter(template => {
    if (formatFilter === 'all') return true;
    return template.format === formatFilter;
  });

  const handleTemplateSelect = (templateId: string) => {
    // Navigate to main editor with template selected
    router.push(`/?template=${templateId}`);
  };

  return (
    <main className="min-h-screen bg-[#121212] text-white font-sans">
      {/* Header */}
      <header className="bg-[#1E1E1E] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Home size={20} />
              <span className="text-sm font-medium">Ana Sayfa</span>
            </Link>
            <span className="text-gray-600">/</span>
            <Link 
              href="/templates"
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              Şablonlar
            </Link>
            <span className="text-gray-600">/</span>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText size={24} className="text-[#FF7F3F]" />
              Blog Şablonları
            </h1>
          </div>
          <div className="text-[#FF7F3F] font-extrabold text-2xl tracking-tighter">KG</div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Page Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4">Blog Şablonları</h2>
          <p className="text-lg text-gray-400">
            Blog yazıları ve makaleler için {BLOG_TEMPLATES.length} farklı şablon
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex items-center gap-4 bg-[#1E1E1E] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Filter size={20} />
            <span className="text-sm font-bold uppercase">Filtrele:</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFormatFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                formatFilter === 'all' 
                  ? 'bg-[#FF7F3F] text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Tümü ({BLOG_TEMPLATES.length})
            </button>
            
            <button
              onClick={() => setFormatFilter('story')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                formatFilter === 'story' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <Instagram size={16} />
              Story ({BLOG_TEMPLATES.filter(t => t.format === 'story').length})
            </button>
            
            <button
              onClick={() => setFormatFilter('post')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                formatFilter === 'post' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <ImageIcon size={16} />
              Post ({BLOG_TEMPLATES.filter(t => t.format === 'post').length})
            </button>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              id={template.id}
              name={template.name}
              description={template.description}
              previewImage={template.previewImage}
              templateType={template.templateType}
              format={template.format}
              layout={template.layout}
              tags={template.tags}
              onSelect={() => handleTemplateSelect(template.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-20">
            <FileText size={64} className="mx-auto text-gray-600 mb-4" />
            <p className="text-xl text-gray-400">Bu filtreye uygun şablon bulunamadı</p>
          </div>
        )}
      </section>
    </main>
  );
}
