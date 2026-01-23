'use client';

import React from 'react';
import Link from 'next/link';
import { ChefHat, FileText, BookOpen, ArrowRight, Home } from 'lucide-react';
import { TEMPLATE_COUNTS } from '@/lib/templates';

export default function TemplatesPage() {
  const categories = [
    {
      id: 'recipe',
      title: 'Tarifler',
      icon: <ChefHat size={48} />,
      description: 'Bebek ve çocuk tarifleri için optimize edilmiş şablonlar',
      count: TEMPLATE_COUNTS.recipe,
      href: '/recipe-templates',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    },
    {
      id: 'blog',
      title: 'Yazılar',
      icon: <FileText size={48} />,
      description: 'Blog yazıları ve makaleler için şablonlar',
      count: TEMPLATE_COUNTS.blog,
      href: '/blog-templates',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'guide',
      title: 'Malzemeler',
      icon: <BookOpen size={48} />,
      description: 'Beslenme rehberi ve malzeme bilgileri için şablonlar',
      count: TEMPLATE_COUNTS.guide,
      href: '/ingredient-templates',
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    }
  ];

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
            <h1 className="text-xl font-bold text-white">Şablon Galerisi</h1>
          </div>
          <div className="text-[#FF7F3F] font-extrabold text-2xl tracking-tighter">KG</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF7F3F] to-[#FF5722] bg-clip-text text-transparent">
            Şablon Kategorileri
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            İçerik tipinize uygun şablonu seçin ve profesyonel sosyal medya görselleri oluşturun
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id}
              href={category.href}
              className="group relative bg-[#1E1E1E] border border-white/10 rounded-3xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#FF7F3F]/50 overflow-hidden"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`${category.bgColor} ${category.borderColor} border-2 w-24 h-24 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>

                {/* Title & Count */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{category.description}</p>
                  <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                    <span className="text-3xl font-bold text-[#FF7F3F]">{category.count}</span>
                    <span className="text-sm text-gray-400">Şablon</span>
                  </div>
                </div>

                {/* View Button */}
                <div className="flex items-center gap-2 text-[#FF7F3F] font-bold group-hover:gap-4 transition-all duration-300 mt-6">
                  <span>Görüntüle</span>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-[#1E1E1E] border border-white/10 rounded-3xl p-8 text-center">
          <p className="text-gray-400 mb-2">Toplam Şablon Sayısı</p>
          <p className="text-6xl font-bold bg-gradient-to-r from-[#FF7F3F] to-[#FF5722] bg-clip-text text-transparent">
            {TEMPLATE_COUNTS.total}
          </p>
        </div>
      </section>
    </main>
  );
}
