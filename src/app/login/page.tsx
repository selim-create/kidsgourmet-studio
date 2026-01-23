'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/api';
import { API_BASE_URL, API_ENDPOINTS, AUTHORIZED_ROLES, STORAGE_KEYS } from '@/lib/constants';
import { Loader2, Lock, ShieldAlert, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginUser(username, password);
      const token = data.token || data.data?.token;
      
      const meResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_ME}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!meResponse.ok) {
         throw new Error('Kullanıcı bilgileri alınamadı.');
      }

      const meData = await meResponse.json();
      const userRoles: string[] = meData.roles || [];
      const hasAccess = userRoles.some(role => AUTHORIZED_ROLES.includes(role));

      if (!hasAccess) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        throw new Error('Bu panele erişim yetkiniz bulunmuyor.');
      }

      router.push('/');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Giriş başarısız.');
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4 font-sans text-gray-100 relative overflow-hidden">
      
      {/* Arka Plan Deseni */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FF7F3F]/10 via-[#121212] to-[#121212]"></div>

      <div className="w-full max-w-md bg-[#1E1E1E] p-10 rounded-3xl shadow-2xl border border-white/5 relative z-10 backdrop-blur-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FF7F3F]/10 text-[#FF7F3F] mb-6 shadow-lg shadow-orange-900/20">
             <Lock size={28} />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            KidsGourmet
          </h1>
          <p className="text-[#FF7F3F] text-sm font-bold uppercase tracking-[0.3em] opacity-90">Studio Girişi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <ShieldAlert size={20} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 group-focus-within:text-[#FF7F3F] transition-colors">Kullanıcı Adı / E-posta</label>
                <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-[#FF7F3F] focus:bg-black/40 outline-none transition-all placeholder-gray-600"
                placeholder="ornek@kidsgourmet.com"
                required
                />
            </div>

            <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 group-focus-within:text-[#FF7F3F] transition-colors">Şifre</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-[#FF7F3F] focus:bg-black/40 outline-none transition-all placeholder-gray-600"
                placeholder="••••••••"
                required
                />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FF7F3F] to-[#FF5722] hover:from-[#FF8A65] hover:to-[#FF7043] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-900/30 active:scale-[0.98] mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Giriş Yap <ChevronRight size={18} /></>}
          </button>
        </form>
        
        <div className="mt-8 text-center">
           <p className="text-xs text-gray-600">
             © 2026 KidsGourmet Studio. Tüm hakları saklıdır.
           </p>
        </div>
      </div>
    </div>
  );
}