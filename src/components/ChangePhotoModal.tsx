import React, { useState } from 'react';
import { User } from '../types';
import { X, Upload, Camera, Check, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ChangePhotoModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (userId: string, newPhotoUrl: string) => void;
}

const PRESET_AVATARS = [
  { id: '1', name: 'Guru Pria 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  { id: '2', name: 'Guru Pria 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { id: '3', name: 'Guru Pria 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
  { id: '4', name: 'Guru Wanita 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
  { id: '5', name: 'Guru Wanita 2', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' },
  { id: '6', name: 'Guru Wanita 3', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80' },
  { id: '7', name: 'Formal Male', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80' },
  { id: '8', name: 'Formal Female', url: 'https://images.unsplash.com/photo-1580894732413-802c63836881?w=300&auto=format&fit=crop&q=80' },
];

export const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({
  user,
  isOpen,
  onClose,
  onSavePhoto
}) => {
  const [photoUrl, setPhotoUrl] = useState(user.foto || '');
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!photoUrl) {
      alert('Silakan pilih atau unggah foto terlebih dahulu');
      return;
    }
    onSavePhoto(user.id, photoUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1E293B]">Ganti Foto Profil</h3>
              <p className="text-xs text-gray-500 font-medium">{user.nama} ({user.role})</p>
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
          
          {/* Current / Preview Photo */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative group">
              <img
                src={photoUrl || user.foto}
                alt="Preview"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-blue-500/20"
              />
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                Preview
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium">Pratinjau Foto Profil Terbaru</p>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'upload' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preset')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'preset' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Koleksi Preset
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'url' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              URL Link Foto
            </button>
          </div>

          {/* Tab 1: Upload File */}
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="file"
                id="user-photo-file-input"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="user-photo-file-input" className="cursor-pointer block space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E293B]">Klik untuk Unggah atau Tarik File Ke Sini</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Format JPG, PNG, WEBP (Maksimal 5MB)</p>
                </div>
              </label>
            </div>
          )}

          {/* Tab 2: Presets */}
          {activeTab === 'preset' && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600">Pilih dari koleksi foto standar guru & staf:</p>
              <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1">
                {PRESET_AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setPhotoUrl(avatar.url)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-square ${
                      photoUrl === avatar.url ? 'border-[#2563EB] ring-2 ring-blue-300' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                    {photoUrl === avatar.url && (
                      <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center text-white">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: URL Input */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-700">Masukkan Link URL Gambar Foto</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customInput.trim()) {
                      setPhotoUrl(customInput.trim());
                    }
                  }}
                  className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-colors"
                >
                  Terapkan
                </button>
              </div>
              <p className="text-[10px] text-gray-400">Pastikan URL berakhiran .jpg, .png, atau dari HTTPS terpercaya.</p>
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
            className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simpan Perubahan Foto</span>
          </button>
        </div>

      </div>
    </div>
  );
};
