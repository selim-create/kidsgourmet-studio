'use client';

import React, { useRef, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SocialCard from '@/components/SocialCard';
import SearchPanel from '@/components/SearchPanel';
import ImageLibrary from '@/components/ImageLibrary';
import { useEditorStore, useSettingsStore } from '@/store';
import { mapWpPostToTemplate } from '@/lib/utils';
import { getDefaultWatermark } from '@/services/api';
import { WpPost, WatermarkPosition, StockImage } from '@/types';
import { toPng } from 'html-to-image';
import { 
  Download, RefreshCcw, Instagram, Image as ImageIcon, 
  Search, Type, Upload, LogOut, LayoutTemplate, Palette, BookOpen, 
  ChefHat, FileText, RotateCcw, ImagePlus, Layers
} from 'lucide-react';
import Link from 'next/link';
import { STORAGE_KEYS, WATERMARK_POSITIONS, DEFAULTS } from '@/lib/constants';
import { ALL_TEMPLATES } from '@/lib/templates';


function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Zustand Stores
  const { data, format, setData, setFormat, setWatermark, resetData, loadFromPost, selectedLayout, setSelectedLayout, setSelectedTemplate } = useEditorStore();
  const { defaultWatermarkUrl, setDefaultWatermark } = useSettingsStore();
  
  // Local State (UI only)
  const [activeTab, setActiveTab] = React.useState<'search' | 'edit' | 'design' | 'library'>('search');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // 1. Auth Kontrolü
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // 2. Template Query Parameter Handler
  useEffect(() => {
    const templateParam = searchParams.get('template');
    if (templateParam) {
      const selectedTemplate = ALL_TEMPLATES.find(t => t.id === templateParam);
      if (selectedTemplate) {
        // Set format (story/post)
        setFormat(selectedTemplate.format);
        // Set layout
        setSelectedLayout(selectedTemplate.layout);
        // Set template ID
        setSelectedTemplate(selectedTemplate.id);
        // Set template type
        setData({ templateType: selectedTemplate.templateType });
        // Switch to edit tab
        setActiveTab('edit');
      }
    }
  }, [searchParams, setFormat, setSelectedLayout, setSelectedTemplate, setData]);

  // 3. Varsayılan Watermark'ı Yükle
  useEffect(() => {
    const loadDefaultWatermark = async () => {
      if (!defaultWatermarkUrl) {
        const url = await getDefaultWatermark();
        setDefaultWatermark(url);
      }
    };
    loadDefaultWatermark();
  }, [defaultWatermarkUrl, setDefaultWatermark]);

  // 3. Arama Seçimi - Zustand kullan
  const handleContentSelect = (post: WpPost) => {
    const mapped = mapWpPostToTemplate(post);
    if (!mapped.image) {
      mapped.image = DEFAULTS.PLACEHOLDER_IMAGE;
    }
    loadFromPost(mapped);
    setActiveTab('edit');
  };

  // 3b. Image Library Selection
  const handleImageSelect = (image: StockImage) => {
    setData({ image: image.url });
    setActiveTab('design');
  };

  // 4. Görsel Yükleme
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setData({ image: url });
    }
  };

  // 5. Filigran Yükleme
  const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setWatermark({ url, isVisible: true });
    }
  };

  // 6. Varsayılan Watermark'ı Kullan
  const handleUseDefaultWatermark = () => {
    setWatermark({ url: defaultWatermarkUrl || DEFAULTS.WATERMARK_URL, isVisible: true });
  };

  // 7. İndirme
  const handleDownload = useCallback(() => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `KG-${data.templateType}-${format}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        setIsGenerating(false);
      })
      .catch(() => setIsGenerating(false));
  }, [data.templateType, format]);

  // 8. Reset
  const handleReset = () => {
    if (confirm('Tüm değişiklikler sıfırlanacak. Emin misiniz?')) {
      resetData();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  // Watermark URL (özel veya varsayılan)
  const effectiveWatermarkUrl = data.watermark.url || defaultWatermarkUrl || DEFAULTS.WATERMARK_URL;

  return (
    <main className="h-screen bg-[#121212] flex overflow-hidden text-gray-100 font-sans">
      
      {/* --- SOL İKON MENÜSÜ --- */}
      <nav className="w-20 bg-[#1E1E1E] border-r border-white/5 flex flex-col items-center py-6 z-20 shadow-xl shrink-0">
        <div className="text-[#FF7F3F] font-extrabold text-2xl mb-10 tracking-tighter">KG</div>
        
        <div className="flex flex-col gap-4 w-full px-2">
          <NavIcon icon={<Search />} label="Ara" active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
          <NavIcon icon={<ImagePlus />} label="Görsel" active={activeTab === 'library'} onClick={() => setActiveTab('library')} />
          <NavIcon icon={<Type />} label="İçerik" active={activeTab === 'edit'} onClick={() => setActiveTab('edit')} />
          <NavIcon icon={<Palette />} label="Tasarım" active={activeTab === 'design'} onClick={() => setActiveTab('design')} />
          
          {/* Templates Link */}
          <Link 
            href="/templates"
            className="w-full aspect-square flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all text-gray-500 hover:bg-white/5 hover:text-[#FF7F3F] group"
            title="Şablonlar"
          >
            <Layers size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold tracking-wide">Şablonlar</span>
          </Link>
        </div>

        <div className="mt-auto w-full px-2 space-y-2">
          <button 
            onClick={handleReset} 
            className="w-full p-3 text-gray-500 hover:text-yellow-500 hover:bg-white/5 rounded-xl transition-all flex flex-col items-center gap-1 group" 
            title="Sıfırla"
          >
            <RotateCcw size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-medium">Sıfırla</span>
          </button>
          
          <button onClick={handleLogout} className="w-full p-3 text-gray-500 hover:text-red-500 hover:bg-white/5 rounded-xl transition-all flex flex-col items-center gap-1 group" title="Çıkış Yap">
             <LogOut size={20} className="group-hover:scale-110 transition-transform" />
             <span className="text-[9px] font-medium">Çıkış</span>
           </button>
        </div>
      </nav>

      {/* --- ORTA PANEL --- */}
      <aside className="w-[400px] bg-[#1E1E1E] border-r border-white/5 flex flex-col h-full z-10 shadow-2xl relative shrink-0">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            {activeTab === 'search' && <><Search size={18} className="text-[#FF7F3F]"/> İçerik Kaynağı</>}
            {activeTab === 'library' && <><ImagePlus size={18} className="text-[#FF7F3F]"/> Görsel Kütüphanesi</>}
            {activeTab === 'edit' && <><Type size={18} className="text-[#FF7F3F]"/> İçerik Düzenle</>}
            {activeTab === 'design' && <><Palette size={18} className="text-[#FF7F3F]"/> Görsel & Ayarlar</>}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* TAB: ARAMA */}
          {activeTab === 'search' && (
            <SearchPanel onSelect={handleContentSelect} />
          )}

          {/* TAB: GÖRSEL KÜTÜPHANESİ */}
          {activeTab === 'library' && (
            <ImageLibrary onSelect={handleImageSelect} defaultQuery="healthy food" />
          )}

          {/* TAB: DÜZENLEME */}
          {activeTab === 'edit' && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block ml-1">Şablon Türü</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'recipe' as const, label: 'Tarif', icon: <ChefHat size={16}/> },
                    { id: 'blog' as const, label: 'Blog', icon: <FileText size={16}/> },
                    { id: 'guide' as const, label: 'Rehber', icon: <BookOpen size={16}/> }
                  ].map(type => (
                    <button 
                      key={type.id}
                      onClick={() => setData({ templateType: type.id })}
                      className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all ${data.templateType === type.id ? 'bg-[#FF7F3F]/10 border-[#FF7F3F] text-[#FF7F3F]' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
                    >
                      {type.icon}
                      <span className="text-xs font-bold">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <InputGroup label="Başlık">
                <textarea 
                  rows={3} 
                  value={data.title} 
                  onChange={e => setData({ title: e.target.value })}
                  className="modern-input"
                />
              </InputGroup>

              <InputGroup label="Kategori">
                 <input type="text" value={data.category} onChange={e => setData({ category: e.target.value })} className="modern-input"/>
              </InputGroup>

              {data.templateType === 'recipe' && (
                <InputGroup label="Malzemeler (Virgülle ayırın)">
                  <textarea 
                    rows={5}
                    value={data.ingredients?.join(', ')} 
                    onChange={e => setData({ ingredients: e.target.value.split(',') })}
                    className="modern-input"
                  />
                </InputGroup>
              )}

              {(data.templateType === 'blog' || data.templateType === 'guide') && (
                 <InputGroup label="Kısa Özet / İçerik">
                   <textarea rows={6} value={data.excerpt} onChange={e => setData({ excerpt: e.target.value })} className="modern-input"/>
                 </InputGroup>
              )}

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-3">
                   <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><ChefHat size={14}/> Uzman / Şef Kartı</span>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={data.expert.isVisible} onChange={e => setData({ expert: { ...data.expert, isVisible: e.target.checked } })} />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF7F3F]"></div>
                   </label>
                </div>
                {data.expert.isVisible && (
                  <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2">
                    <input type="text" placeholder="Ad Soyad" value={data.expert.name} onChange={e => setData({ expert: { ...data.expert, name: e.target.value } })} className="modern-input"/>
                    <input type="text" placeholder="Ünvan" value={data.expert.title} onChange={e => setData({ expert: { ...data.expert, title: e.target.value } })} className="modern-input"/>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: TASARIM */}
          {activeTab === 'design' && (
            <div className="space-y-8">
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-3 block ml-1">Arka Plan Görseli</label>
                <div className="flex flex-col gap-3">
                   <div className="flex gap-2">
                      <input type="text" placeholder="URL Yapıştır..." value={data.image} onChange={e => setData({ image: e.target.value })} className="modern-input flex-1"/>
                   </div>
                   <label className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 p-4 rounded-xl border border-dashed border-gray-600 cursor-pointer transition-all hover:border-[#FF7F3F] hover:text-[#FF7F3F]">
                      <Upload size={20} />
                      <span className="text-sm font-medium">Bilgisayardan Yükle</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                   </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-3 block ml-1">Çıktı Boyutu</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setFormat('story')} className={`format-btn ${format === 'story' ? 'active' : ''}`}><Instagram size={18}/> Story (9:16)</button>
                  <button onClick={() => setFormat('post')} className={`format-btn ${format === 'post' ? 'active' : ''}`}><ImageIcon size={18}/> Post (1:1)</button>
                </div>
              </div>

              {/* Gelişmiş Watermark Bölümü */}
              <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <LayoutTemplate size={16}/> Filigran / Logo
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={data.watermark.isVisible} 
                      onChange={e => setWatermark({ isVisible: e.target.checked })}
                    />
                    <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF7F3F]"></div>
                  </label>
                </div>
                
                {data.watermark.isVisible && (
                  <div className="space-y-5">
                    
                    {/* Watermark Önizleme */}
                    <div className="flex items-center gap-4 p-3 bg-black/20 rounded-xl">
                      <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                        {effectiveWatermarkUrl ? (
                          <img 
                            src={effectiveWatermarkUrl} 
                            alt="Watermark" 
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <LayoutTemplate size={24} className="text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400">Aktif Filigran</p>
                        <p className="text-sm text-white truncate">
                          {data.watermark.url ? 'Özel Logo' : 'KidsGourmet Logo'}
                        </p>
                      </div>
                    </div>

                    {/* Varsayılan Logo Butonu */}
                    <button
                      onClick={handleUseDefaultWatermark}
                      className="w-full py-3 px-4 bg-[#FF7F3F]/20 hover:bg-[#FF7F3F]/30 border border-[#FF7F3F]/50 rounded-xl text-[#FF7F3F] text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <ImageIcon size={16} />
                      KidsGourmet Logo Kullan
                    </button>

                    {/* Özel Logo Yükle */}
                    <label className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 p-4 rounded-xl border border-dashed border-gray-600 cursor-pointer transition-colors">
                      <Upload size={20} />
                      <span className="text-sm font-medium">Özel Logo Yükle</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/png, image/jpeg, image/svg+xml" 
                        onChange={handleWatermarkUpload} 
                      />
                    </label>

                    {/* URL ile Logo */}
                    <input
                      type="text"
                      placeholder="veya Logo URL'si yapıştır..."
                      value={data.watermark.url}
                      onChange={e => setWatermark({ url: e.target.value })}
                      className="modern-input text-sm"
                    />

                    {/* Pozisyon Seçici */}
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase font-bold mb-3 block">Pozisyon</label>
                      <div className="grid grid-cols-3 gap-2">
                        {WATERMARK_POSITIONS.map((pos) => (
                          <button
                            key={pos.id}
                            onClick={() => setWatermark({ position: pos.id as WatermarkPosition })}
                            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                              data.watermark.position === pos.id
                                ? 'bg-[#FF7F3F] text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            <span>{pos.icon}</span>
                            <span className="hidden sm:inline">{pos.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Opacity Slider */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Opaklık</label>
                        <span className="text-[10px] text-gray-400">{Math.round(data.watermark.opacity * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="1" 
                        step="0.05" 
                        value={data.watermark.opacity} 
                        onChange={e => setWatermark({ opacity: parseFloat(e.target.value) })}
                        className="w-full accent-[#FF7F3F] h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Scale Slider */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Boyut</label>
                        <span className="text-[10px] text-gray-400">{data.watermark.scale.toFixed(1)}x</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.3" 
                        max="2" 
                        step="0.1" 
                        value={data.watermark.scale} 
                        onChange={e => setWatermark({ scale: parseFloat(e.target.value) })}
                        className="w-full accent-[#FF7F3F] h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Watermark Temizle */}
                    {data.watermark.url && (
                      <button
                        onClick={() => setWatermark({ url: '' })}
                        className="w-full py-2 text-xs text-gray-500 hover:text-red-400 transition-colors"
                      >
                        Özel logoyu kaldır (varsayılana dön)
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        <div className="p-6 border-t border-white/5 bg-[#1E1E1E]">
           <button 
             onClick={handleDownload}
             disabled={isGenerating}
             className="w-full bg-gradient-to-r from-[#FF7F3F] to-[#FF5722] hover:from-[#FF8A65] hover:to-[#FF7043] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isGenerating ? <RefreshCcw className="animate-spin" /> : <Download />}
             GÖRSELİ İNDİR
           </button>
        </div>
      </aside>

      {/* --- SAĞ PANEL (CANVAS) --- */}
      <div className="flex-1 bg-[#0F0F0F] flex items-center justify-center relative overflow-hidden p-8">
         {/* Arka Plan Deseni */}
         <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:24px_24px]"></div>
         
         {/* Scale Değerleri Düşürüldü */}
         <div className="transform-gpu scale-[0.25] md:scale-[0.3] lg:scale-[0.35] xl:scale-[0.4] 2xl:scale-[0.5] transition-all duration-500 shadow-2xl ring-1 ring-white/5 relative z-10 flex-shrink-0 origin-center">
            <SocialCard ref={cardRef} format={format} data={data} defaultWatermarkUrl={effectiveWatermarkUrl} layout={selectedLayout} />
         </div>
      </div>

    </main>
  );
}

// --- Alt Bileşenler & Stiller ---

// HATA DÜZELTİLDİ: React.cloneElement tipi ve prop yapısı
const NavIcon = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full aspect-square flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all ${active ? 'bg-[#FF7F3F] text-white shadow-lg shadow-orange-900/20' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
  >
    {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 20 }) : icon}
    <span className="text-[10px] font-bold tracking-wide">{label}</span>
  </button>
);

const InputGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div>
    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block ml-1">{label}</label>
    {children}
  </div>
);

export default function Home() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}