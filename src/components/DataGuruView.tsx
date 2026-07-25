import React, { useState } from 'react';
import { User } from '../types';
import { Users, QrCode, Search, Phone, Mail, MapPin, Camera } from 'lucide-react';

interface DataGuruViewProps {
  users: User[];
  onShowQRModal: (guru: User) => void;
  onEditPhoto?: (guru: User) => void;
}

export const DataGuruView: React.FC<DataGuruViewProps> = ({ users, onShowQRModal, onEditPhoto }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = users.filter(u => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (u.nama || '').toLowerCase().includes(term) ||
      (u.nip || '').includes(term) ||
      (u.jabatan || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-6 pb-20 sm:pb-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <span>Direktori Data Guru & Tenaga Pendidik</span>
          </h2>
          <p className="text-xs text-slate-500">SDN 1 Sangkorang • Total {users.length} Tenaga Pendidik</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari guru atau NIP..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(guru => (
          <div
            key={guru.id}
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <div className="relative group shrink-0">
                {guru.foto ? (
                  <img
                    src={guru.foto}
                    alt={guru.nama}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 border-2 border-slate-100 shadow-sm flex items-center justify-center font-bold text-slate-600 text-lg">
                    {guru.nama?.[0] || 'G'}
                  </div>
                )}
                {onEditPhoto && (
                  <button
                    type="button"
                    onClick={() => onEditPhoto(guru)}
                    className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    title="Ganti Foto Guru"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${guru.status === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{guru.role}</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{guru.nama}{guru.gelar ? `, ${guru.gelar}` : ''}</h3>
                <p className="text-xs font-semibold text-blue-600 line-clamp-1">{guru.jabatan}</p>
                <p className="text-[11px] font-mono text-slate-400">NIP: {guru.nip}</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{guru.noHp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="line-clamp-1">{guru.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="line-clamp-1">{guru.alamat}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onShowQRModal(guru)}
              className="w-full py-2 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4 text-purple-600" />
              <span>Tampilkan QR Code Guru</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
