import React, { useState } from 'react';
import { User, IzinRecord } from '../types';
import { FileText, Upload, Calendar, Send, AlertCircle } from 'lucide-react';

interface IzinSakitModalProps {
  currentUser: User;
  initialType?: 'Izin' | 'Sakit';
  onClose: () => void;
  onSubmit: (record: Omit<IzinRecord, 'id' | 'statusApproval' | 'tanggalPengajuan'>) => void;
}

export const IzinSakitModal: React.FC<IzinSakitModalProps> = ({
  currentUser,
  initialType = 'Izin',
  onClose,
  onSubmit
}) => {
  const [tipe, setTipe] = useState<'Izin' | 'Sakit'>(initialType);
  const [tanggalMulai, setTanggalMulai] = useState(new Date().toISOString().split('T')[0]);
  const [tanggalSelesai, setTanggalSelesai] = useState(new Date().toISOString().split('T')[0]);
  const [alasan, setAlasan] = useState('');
  const [dokumenFile, setDokumenFile] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setDokumenFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alasan.trim()) {
      alert('Silakan tuliskan alasan permohonan secara lengkap.');
      return;
    }

    onSubmit({
      guruId: currentUser.id,
      guruNama: currentUser.nama + (currentUser.gelar ? `, ${currentUser.gelar}` : ''),
      guruNip: currentUser.nip,
      tipe,
      tanggalMulai,
      tanggalSelesai,
      alasan,
      dokumenUrl: dokumenFile || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80'
    });

    alert('✅ Surat pengajuan Izin/Sakit & lampiran file berhasil disimpan!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Form Permohonan {tipe}</h3>
              <p className="text-xs text-blue-100">SDN 1 Sangkorang • Pengajuan Ke Kepala Sekolah</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-white/80 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Choice Pill */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setTipe('Izin')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tipe === 'Izin' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📝 Permohonan Izin
            </button>
            <button
              type="button"
              onClick={() => setTipe('Sakit')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tipe === 'Sakit' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏥 Surat Keterangan Sakit
            </button>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                value={tanggalMulai}
                onChange={e => setTanggalMulai(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Selesai</label>
              <input
                type="date"
                value={tanggalSelesai}
                onChange={e => setTanggalSelesai(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          {/* Reason textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alasan / Keterangan {tipe}
            </label>
            <textarea
              required
              rows={3}
              value={alasan}
              onChange={e => setAlasan(e.target.value)}
              placeholder={tipe === 'Izin' ? 'Contoh: Menghadiri bimbingan teknis / keperluan keluarga...' : 'Contoh: Demam dan flu berat, melampirkan surat dokter...'}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Document attachment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dokumen Pendukung / Surat Dokter (Opsional)
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-4 text-center bg-slate-50 transition-colors">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                <Upload className="w-6 h-6 text-blue-600" />
                <span className="text-xs font-semibold text-slate-700">Unggah Foto Surat / Dokumen</span>
                <span className="text-[10px] text-slate-400">PNG, JPG atau PDF maks 5MB</span>
              </label>
            </div>
            {dokumenFile && (
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">✓ Dokumen berhasil dilampirkan.</p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Permohonan</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
