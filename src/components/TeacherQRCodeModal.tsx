import React from 'react';
import { User, SekolahConfig } from '../types';
import { QrCode, Download, ShieldCheck } from 'lucide-react';

interface TeacherQRCodeModalProps {
  guru: User;
  sekolah: SekolahConfig;
  onClose: () => void;
}

export const TeacherQRCodeModal: React.FC<TeacherQRCodeModalProps> = ({ guru, sekolah, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold"
        >
          ✕
        </button>

        <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mx-auto">
          <QrCode className="w-7 h-7" />
        </div>

        <div>
          <h3 className="font-extrabold text-slate-900 text-base">{guru.nama}{guru.gelar ? `, ${guru.gelar}` : ''}</h3>
          <p className="text-xs text-blue-600 font-semibold">{guru.jabatan}</p>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">NIP: {guru.nip}</p>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block mx-auto shadow-inner">
          <div className="w-48 h-48 bg-white p-3 rounded-xl border border-slate-300 flex flex-col items-center justify-center space-y-2">
            <QrCode className="w-32 h-32 text-slate-800" />
            <span className="text-[10px] font-mono text-slate-500 font-bold">{guru.qrCodeUrl}</span>
          </div>
        </div>

        <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>QR Kartu Presensi Digital Resmi {sekolah.namaSekolah}</span>
        </div>

        <button
          type="button"
          onClick={() => {
            alert(`QR Code untuk ${guru.nama} berhasil diunduh ke galeri!`);
          }}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Unduh QR Kartu Guru</span>
        </button>
      </div>
    </div>
  );
};
