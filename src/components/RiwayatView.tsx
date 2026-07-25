import React, { useState } from 'react';
import { PresensiRecord, SekolahConfig, User } from '../types';
import { Calendar, Filter, Download, Search, CheckCircle2, MapPin, Clock, Camera } from 'lucide-react';
import { exportPresensiToCSV } from '../utils/excelExporter';

interface RiwayatViewProps {
  presensiList: PresensiRecord[];
  sekolah: SekolahConfig;
  currentUser: User;
}

export const RiwayatView: React.FC<RiwayatViewProps> = ({ presensiList, sekolah, currentUser }) => {
  const [filterPeriod, setFilterPeriod] = useState<'Hari' | 'Minggu' | 'Bulan' | 'Tahun'>('Bulan');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null);

  // Filter records based on role & search
  const filteredRecords = presensiList.filter(rec => {
    // If regular teacher, show only their own records unless admin/principal/operator
    if (currentUser.role === 'Guru' && rec.guruId !== currentUser.id) {
      return false;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        rec.guruNama.toLowerCase().includes(term) ||
        rec.guruNip.includes(term) ||
        rec.tanggal.includes(term) ||
        rec.statusMasuk.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-6 pb-20 sm:pb-8">
      
      {/* Top Title & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Riwayat & Logs Kehadiran</span>
          </h2>
          <p className="text-xs text-slate-500">
            Daftar lengkap rekam presensi digital berbasis GPS & Selfie Watermark
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportPresensiToCSV(filteredRecords, sekolah, `riwayat_presensi_${filterPeriod.toLowerCase()}.csv`)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
          {(['Hari', 'Minggu', 'Bulan', 'Tahun'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setFilterPeriod(p)}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterPeriod === p ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Filter {p}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari nama, NIP, atau tanggal..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>
      </div>

      {/* Records Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <th className="py-3 px-3">Tanggal</th>
              <th className="py-3 px-3">Nama Guru</th>
              <th className="py-3 px-3">Jam Masuk</th>
              <th className="py-3 px-3">Jam Pulang</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Jarak GPS</th>
              <th className="py-3 px-3">Foto Watermark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400 font-medium">
                  Belum ada riwayat presensi yang sesuai dengan filter pencarian.
                </td>
              </tr>
            ) : (
              filteredRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800">{rec.tanggal}</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900">{rec.guruNama}</p>
                    <p className="text-[10px] text-slate-400">NIP: {rec.guruNip}</p>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{rec.jamMasuk || '-'}</td>
                  <td className="py-3 px-3 font-medium text-slate-700">{rec.jamPulang || '-'}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      rec.statusMasuk === 'Hadir' ? 'bg-emerald-100 text-emerald-800' :
                      rec.statusMasuk === 'Terlambat' ? 'bg-purple-100 text-purple-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {rec.statusMasuk}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {rec.lokasiMasuk ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                        📍 {rec.lokasiMasuk.jarakMeter}m
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {rec.fotoSelfieMasuk ? (
                      <button
                        type="button"
                        onClick={() => setSelectedPhotoModal(rec.fotoSelfieMasuk || null)}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold rounded-lg border border-blue-200 flex items-center gap-1 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Lihat Foto</span>
                      </button>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Photo Preview Modal */}
      {selectedPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-4 max-w-lg w-full relative">
            <button
              type="button"
              onClick={() => setSelectedPhotoModal(null)}
              className="absolute top-3 right-3 p-2 bg-slate-100 hover:bg-slate-200 rounded-full font-bold"
            >
              ✕
            </button>
            <h4 className="text-sm font-bold text-slate-800 mb-3">Foto Selfie Watermark Presensi</h4>
            {selectedPhotoModal ? (
              <img src={selectedPhotoModal} alt="" className="w-full rounded-2xl border border-slate-200 shadow-md" />
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">Foto tidak tersedia</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
