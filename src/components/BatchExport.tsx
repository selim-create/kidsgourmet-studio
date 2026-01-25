'use client';

import React, { useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface BatchExportProps {
  isOpen: boolean;
  onClose: () => void;
  cardRef: React.RefObject<HTMLDivElement | null>; // <- "| null" eklendi
  fileName: string;
}

const EXPORT_FORMATS = ['story', 'post'] as const;

export default function BatchExport({ isOpen, onClose, cardRef, fileName }: BatchExportProps) {
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');
  const [jpegQuality, setJpegQuality] = useState(0.9);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleBatchExport = async () => {
    if (!cardRef.current) return;
    
    setIsExporting(true);
    setProgress(0);

    try {
      const zip = new JSZip();
      const totalSteps = EXPORT_FORMATS.length;

      for (let i = 0; i < EXPORT_FORMATS.length; i++) {
        const format = EXPORT_FORMATS[i];
        setProgress(((i + 1) / totalSteps) * 100);

        // Generate image
        const exportFunc = exportFormat === 'png' ? toPng : toJpeg;
        const options = exportFormat === 'png' 
          ? { cacheBust: true, pixelRatio: 2 }
          : { cacheBust: true, pixelRatio: 2, quality: jpegQuality };

        const dataUrl = await exportFunc(cardRef.current, options);
        
        // Convert data URL to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        
        // Add to ZIP
        const extension = exportFormat === 'png' ? 'png' : 'jpg';
        zip.file(`${fileName}-${format}.${extension}`, blob);
      }

      // Generate ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${fileName}-batch.zip`);

      setProgress(100);
      setTimeout(() => {
        onClose();
        setIsExporting(false);
        setProgress(0);
      }, 500);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setProgress(0);
      alert('Dışa aktarma başarısız oldu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E1E1E] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Download size={24} className="text-[#FF7F3F]" />
            Toplu İndirme
          </h2>
          <button 
            onClick={onClose}
            disabled={isExporting}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Format Selection */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
              Format Seçimi
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setExportFormat('png')}
                disabled={isExporting}
                className={`py-3 rounded-xl font-bold text-sm transition-all ${
                  exportFormat === 'png'
                    ? 'bg-[#FF7F3F] text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                } disabled:opacity-50`}
              >
                PNG
              </button>
              <button
                onClick={() => setExportFormat('jpeg')}
                disabled={isExporting}
                className={`py-3 rounded-xl font-bold text-sm transition-all ${
                  exportFormat === 'jpeg'
                    ? 'bg-[#FF7F3F] text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                } disabled:opacity-50`}
              >
                JPEG
              </button>
            </div>
          </div>

          {/* JPEG Quality Slider */}
          {exportFormat === 'jpeg' && (
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Kalite
                </label>
                <span className="text-xs text-gray-400">
                  {Math.round(jpegQuality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={jpegQuality}
                onChange={(e) => setJpegQuality(parseFloat(e.target.value))}
                disabled={isExporting}
                className="w-full accent-[#FF7F3F] h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
            </div>
          )}

          {/* Info */}
          <div className="bg-white/5 rounded-lg p-3 text-xs text-gray-400">
            📦 Story ve Post formatları ZIP dosyası olarak indirilecek
          </div>
        </div>

        {/* Progress Bar */}
        {isExporting && (
          <div className="mb-6">
            <div className="flex justify-between mb-2 text-xs text-gray-400">
              <span>İlerleme</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#FF7F3F] to-[#FF5722] h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Export Button */}
        <button
          onClick={handleBatchExport}
          disabled={isExporting}
          className="w-full bg-gradient-to-r from-[#FF7F3F] to-[#FF5722] hover:from-[#FF8A65] hover:to-[#FF7043] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              DIŞA AKTARILIYOR...
            </>
          ) : (
            <>
              <Download size={20} />
              ZIP OLARAK İNDİR
            </>
          )}
        </button>
      </div>
    </div>
  );
}
