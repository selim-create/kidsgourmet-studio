'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SocialCard from '@/components/SocialCard';
import SearchPanel from '@/components/SearchPanel';
import { mapWpPostToTemplate } from '@/lib/utils';
import { TemplateData, SocialFormat, WatermarkPosition, WpPost } from '@/types';
import { toPng } from 'html-to-image';
import { 
  Download, RefreshCcw, Instagram, Image as ImageIcon, 
  Search, Type, Upload, LogOut, LayoutTemplate, Palette, BookOpen, ChefHat, FileText, ImagePlus
} from 'lucide-react';
import { STORAGE_KEYS } from '@/lib/constants';

// --- Default Data ---
const DEFAULT_DATA: TemplateData = {
  id: 'init',
  templateType: 'recipe',
  title: 'İçerik Başlığı',
  image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af',
  category: 'Kategori',
  ingredients: ['Malzeme 1', 'Malzeme 2'],
  excerpt: 'İçerik özeti buraya gelecek.',
  author: { name: 'KidsGourmet', avatarUrl: '', isVisible: true },
  expert: { name: 'Dyt. Uzman Adı', title: 'Beslenme Uzmanı', isVisible: true, isVerified: true },
  watermark: { isVisible: true, url: '', position: 'top-right', opacity: 1, scale: 1 },
  theme: 'modern'
};

export default function Home() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // State
  const [activeTab, setActiveTab] = useState<'search' | 'edit' | 'design'>('search');
  const [data, setData] = useState<TemplateData>(DEFAULT_DATA);
  const [format, setFormat] = useState<SocialFormat>('story');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 1. Auth Kontrolü
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // 2. Arama Seçimi
  const handleContentSelect = (post: WpPost) => {
    const mapped = mapWpPostToTemplate(post);
    if (!mapped.image) {
       mapped.image = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af';
    }
    setData(prev => ({ ...mapped, watermark: prev.watermark }));
    setActiveTab('edit'); 
  };

  // 3. Görsel Yükleme
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setData(prev => ({ ...prev, image: url }));
    }
  };

  // 4. Filigran Yükleme
  const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setData(prev => ({ 
        ...prev, 
        watermark: { ...prev.watermark, url: url, isVisible: true } 
      }));
    }
  };

  // 5. İndirme
  const handleDownload = useCallback(() => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `KG-${data.templateType}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        setIsGenerating(false);
      })
      .catch(() => setIsGenerating(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <main className="h-screen bg-[#121212] flex overflow-hidden text-gray-100 font-sans">
      
      {/* --- SOL İKON MENÜSÜ --- */}
      <nav className="w-20 bg-[#1E1E1E] border-r border-white/5 flex flex-col items-center py-6 z-20 shadow-xl shrink-0">
        <div className="text-[#FF7F3F] font-extrabold text-2xl mb-10 tracking-tighter">KG</div>
        
        <div className="flex flex-col gap-4 w-full px-2">
          <NavIcon icon={<Search />} label="Ara" active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
          <NavIcon icon={<Type />} label="İçerik" active={activeTab === 'edit'} onClick={() => setActiveTab('edit')} />
          <NavIcon icon={<Palette />} label="Tasarım" active={activeTab === 'design'} onClick={() => setActiveTab('design')} />
        </div>

        <div className="mt-auto w-full px-2">
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
            {activeTab === 'edit' && <><Type size={18} className="text-[#FF7F3F]"/> İçerik Düzenle</>}
            {activeTab === 'design' && <><Palette size={18} className="text-[#FF7F3F]"/> Görsel & Ayarlar</>}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* TAB: ARAMA */}
          {activeTab === 'search' && (
            <SearchPanel onSelect={handleContentSelect} />
          )}

          {/* TAB: DÜZENLEME */}
          {activeTab === 'edit' && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block ml-1">Şablon Türü</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'recipe', label: 'Tarif', icon: <ChefHat size={16}/> },
                    { id: 'blog', label: 'Blog', icon: <FileText size={16}/> },
                    { id: 'guide', label: 'Rehber', icon: <BookOpen size={16}/> }
                  ].map(type => (
                    <button 
                      key={type.id}
                      onClick={() => setData({ ...data, templateType: type.id as any })}
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
                  onChange={e => setData({...data, title: e.target.value})}
                  className="modern-input"
                />
              </InputGroup>

              <InputGroup label="Kategori">
                 <input type="text" value={data.category} onChange={e => setData({...data, category: e.target.value})} className="modern-input"/>
              </InputGroup>

              {data.templateType === 'recipe' && (
                <InputGroup label="Malzemeler (Virgülle ayırın)">
                  <textarea 
                    rows={5}
                    value={data.ingredients?.join(', ')} 
                    onChange={e => setData({...data, ingredients: e.target.value.split(',')})}
                    className="modern-input"
                  />
                </InputGroup>
              )}

              {(data.templateType === 'blog' || data.templateType === 'guide') && (
                 <InputGroup label="Kısa Özet / İçerik">
                   <textarea rows={6} value={data.excerpt} onChange={e => setData({...data, excerpt: e.target.value})} className="modern-input"/>
                 </InputGroup>
              )}

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-3">
                   <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><ChefHat size={14}/> Uzman / Şef Kartı</span>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={data.expert.isVisible} onChange={e => setData({...data, expert: {...data.expert, isVisible: e.target.checked}})} />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF7F3F]"></div>
                   </label>
                </div>
                {data.expert.isVisible && (
                  <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2">
                    <input type="text" placeholder="Ad Soyad" value={data.expert.name} onChange={e => setData({...data, expert: {...data.expert, name: e.target.value}})} className="modern-input"/>
                    <input type="text" placeholder="Ünvan" value={data.expert.title} onChange={e => setData({...data, expert: {...data.expert, title: e.target.value}})} className="modern-input"/>
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
                      <input type="text" placeholder="URL Yapıştır..." value={data.image} onChange={e => setData({...data, image: e.target.value})} className="modern-input flex-1"/>
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

              <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                 <div className="flex justify-between items-center mb-5">
                    <span className="text-sm font-bold text-white flex items-center gap-2"><LayoutTemplate size={16}/> Filigran / Logo</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={data.watermark.isVisible} onChange={e => setData({...data, watermark: {...data.watermark, isVisible: e.target.checked}})} />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF7F3F]"></div>
                   </label>
                 </div>
                 
                 {data.watermark.isVisible && (
                   <div className="space-y-5">
                      
                      <label className="flex items-center justify-between bg-black/20 hover:bg-black/30 p-3 rounded-lg border border-white/10 cursor-pointer transition-colors group">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white">
                               <ImagePlus size={18} />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-xs font-bold text-gray-200">Görsel Seç</span>
                               <span className="text-[10px] text-gray-500">{data.watermark.url ? 'Değiştirmek için tıkla' : 'Logo veya Badge yükle'}</span>
                            </div>
                         </div>
                         <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleWatermarkUpload} />
                      </label>

                      <div>
                         <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Pozisyon</label>
                         <div className="grid grid-cols-3 gap-2 w-32 mx-auto bg-black/20 p-2 rounded-lg">
                            {['top-left', 'center', 'top-right', 'center', 'center', 'center', 'bottom-left', 'center', 'bottom-right'].map((pos, i) => {
                                if (i === 1 || i === 3 || i === 5 || i === 7) return <div key={i}></div>; 
                                if (i === 4) return <PosBtn key={i} pos="center" active={data.watermark.position} onClick={p => setData({...data, watermark: {...data.watermark, position: p}})} icon={<div className="w-1.5 h-1.5 rounded-full bg-current"/>} />;
                                return <PosBtn key={i} pos={pos as WatermarkPosition} active={data.watermark.position} onClick={p => setData({...data, watermark: {...data.watermark, position: p}})} />;
                            })}
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div>
                            <div className="flex justify-between mb-1">
                               <label className="text-[10px] text-gray-500 uppercase font-bold">Opaklık</label>
                               <span className="text-[10px] text-gray-400">{Math.round(data.watermark.opacity * 100)}%</span>
                            </div>
                            <input 
                              type="range" min="0.1" max="1" step="0.1" 
                              value={data.watermark.opacity} 
                              onChange={e => setData({...data, watermark: {...data.watermark, opacity: parseFloat(e.target.value)}})}
                              className="w-full accent-[#FF7F3F] h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                         </div>
                         <div>
                            <div className="flex justify-between mb-1">
                               <label className="text-[10px] text-gray-500 uppercase font-bold">Boyut</label>
                               <span className="text-[10px] text-gray-400">{data.watermark.scale}x</span>
                            </div>
                            <input 
                              type="range" min="0.5" max="3" step="0.1" 
                              value={data.watermark.scale} 
                              onChange={e => setData({...data, watermark: {...data.watermark, scale: parseFloat(e.target.value)}})}
                              className="w-full accent-[#FF7F3F] h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                         </div>
                      </div>
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
            <SocialCard ref={cardRef} format={format} data={data} />
         </div>
      </div>

    </main>
  );
}

// --- Alt Bileşenler & Stiller ---

interface PosBtnProps {
  pos: WatermarkPosition | 'center';
  active: string;
  onClick: (p: WatermarkPosition) => void;
  icon?: React.ReactNode;
}

// HATA DÜZELTİLDİ: React.cloneElement tipi ve prop yapısı
const NavIcon = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full aspect-square flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all ${active ? 'bg-[#FF7F3F] text-white shadow-lg shadow-orange-900/20' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
  >
    {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 20 }) : icon}
    <span className="text-[10px] font-bold tracking-wide">{label}</span>
  </button>
);

const InputGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div>
    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block ml-1">{label}</label>
    {children}
  </div>
);

const PosBtn = ({ pos, active, onClick, icon }: PosBtnProps) => (
  <button 
    onClick={() => onClick(pos as WatermarkPosition)}
    className={`w-full aspect-square rounded flex items-center justify-center transition-colors border ${active === pos ? 'bg-[#FF7F3F] border-[#FF7F3F] text-white' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
  >
    {icon || <div className={`w-1.5 h-1.5 rounded-full ${active === pos ? 'bg-white' : 'bg-gray-500'}`}/>}
  </button>
);