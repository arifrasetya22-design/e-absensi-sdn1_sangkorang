import React, { useState } from 'react';
import { SekolahConfig } from '../types';
import { X, Upload, Building2, Check, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';

interface ChangeLogoModalProps {
  sekolah: SekolahConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaveLogo: (newLogoUrl: string) => void;
}

const LOGO_PRESETS = [
  { id: '1', name: 'Tut Wuri Handayani', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop&q=80' },
  { id: '2', name: 'Logo Sekolah Dasar', url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80' },
  { id: '3', name: 'Gedung Sekolah', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&auto=format&fit=crop&q=80' },
  { id: '4', name: 'Logo Pendidikan 1', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&auto=format&fit=crop&q=80' },
];

export const ChangeLogoModal: React.FC<ChangeLogoModalProps> = ({
  sekolah,
  isOpen,
  onClose,
  onSaveLogo
}) => {
  const [logoUrl, setLogoUrl] = useState(sekolah.logoUrl || '');
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadError, setUploadError] = useState('');

  if (!isOpen) return null;

  const processLogoFile = async (file: File) => {
    setUploadError('');
    if (!file.type.startsWith('image/')) {
      setUploadError('Harap pilih file gambar logo (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Ukuran file logo terlalu besar. Maksimal 15MB.');
      return;
    }

    try {
      setIsCompressing(true);
      const compressedBase64 = await compressImageFile(file, 300, 300, 0.85);
      setLogoUrl(compressedBase64);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Gagal memproses file logo.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processLogoFile(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    if (!logoUrl) {
      alert('Silakan pilih atau unggah logo sekolah terlebih dahulu');
      return;
    }
    onSaveLogo(logoUrl);
    alert('✅ Logo website & sekolah berhasil diperbarui & disimpan!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1E293B]">Ganti Logo Website & Sekolah</h3>
              <p className="text-xs text-gray-500 font-medium">{sekolah.namaSekolah}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Current / Preview Logo */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-24 h-24 rounded-2xl border-2 border-gray-200 p-2 bg-white shadow-xs flex items-center justify-center overflow-hidden">
              {(logoUrl || sekolah.logoUrl) ? (
                <img
                  src={logoUrl || sekolah.logoUrl}
                  alt="Logo Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop&q=80';
                  }}
                />
              ) : (
                <Building2 className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <p className="text-xs text-gray-500 font-medium">Pratinjau Logo Website Utama Header</p>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'upload' ? 'bg-white text-purple-700 shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Upload Gambar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preset')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'preset' ? 'bg-white text-purple-700 shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Preset Logo SD
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'url' ? 'bg-white text-purple-700 shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              URL Link Logo
            </button>
          </div>

          {/* Tab 1: Upload File */}
          {activeTab === 'upload' && (
            <div className="space-y-2">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                  dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="file"
                  id="logo-file-input"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isCompressing}
                />
                <label htmlFor="logo-file-input" className="cursor-pointer block space-y-2">
                  <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center mx-auto">
                    {isCompressing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E293B]">
                      {isCompressing ? 'Sedang Memproses & Mengompres Logo...' : 'Klik untuk Unggah Logo File Baru (PNG/JPG)'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Rekomendasi rasio 1:1 transparan atau persegi (Otomatis Dioptimalkan)</p>
                  </div>
                </label>
              </div>
              {uploadError && (
                <p className="text-xs text-rose-600 font-semibold text-center">{uploadError}</p>
              )}
            </div>
          )}

          {/* Tab 2: Presets */}
          {activeTab === 'preset' && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600">Pilih dari logo standar instansi sekolah:</p>
              <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1">
                {LOGO_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setLogoUrl(preset.url)}
                    className={`flex items-center gap-3 p-2.5 rounded-2xl border-2 text-left transition-all ${
                      logoUrl === preset.url ? 'border-purple-600 bg-purple-50/50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1E293B] truncate">{preset.name}</p>
                    </div>
                    {logoUrl === preset.url && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: URL Input */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-700">Masukkan Link URL Gambar Logo</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-purple-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUrl.trim()) {
                      setLogoUrl(customUrl.trim());
                    }
                  }}
                  className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-colors"
                >
                  Terapkan
                </button>
              </div>
              <p className="text-[10px] text-gray-400">Pastikan URL gambar langsung menuju file .png atau .jpg</p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simpan Logo Website</span>
          </button>
        </div>

      </div>
    </div>
  );
};
