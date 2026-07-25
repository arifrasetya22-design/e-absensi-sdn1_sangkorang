import React from 'react';
import { User, PresensiRecord, SekolahConfig, RekapBulanan } from '../types';
import {
  Camera,
  MapPin,
  FileEdit,
  Stethoscope,
  Calendar,
  BarChart3,
  Users,
  School,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Download
} from 'lucide-react';
import { TabType } from './BottomNav';

interface GuruDashboardProps {
  currentUser: User;
  sekolah: SekolahConfig;
  todayRecord?: PresensiRecord;
  rekap: RekapBulanan;
  onOpenAbsenMasuk: () => void;
  onOpenAbsenPulang: () => void;
  onOpenFormIzinSakit: (type: 'Izin' | 'Sakit') => void;
  onChangeTab: (tab: TabType) => void;
  onGenerateSlip: () => void;
}

export const GuruDashboard: React.FC<GuruDashboardProps> = ({
  currentUser,
  sekolah,
  todayRecord,
  rekap,
  onOpenAbsenMasuk,
  onOpenAbsenPulang,
  onOpenFormIzinSakit,
  onChangeTab,
  onGenerateSlip
}) => {
  const menuGrid = [
    { id: 'selfie', label: 'Selfie', icon: <Camera className="w-6 h-6" />, iconStyle: 'bg-blue-100 text-[#2563EB]', action: onOpenAbsenMasuk },
    { id: 'gps', label: 'Lokasi GPS', icon: <MapPin className="w-6 h-6" />, iconStyle: 'bg-green-100 text-[#22C55E]', action: () => onChangeTab('sekolah') },
    { id: 'izin', label: 'Izin', icon: <FileEdit className="w-6 h-6" />, iconStyle: 'bg-orange-100 text-orange-600', action: () => onOpenFormIzinSakit('Izin') },
    { id: 'sakit', label: 'Sakit', icon: <Stethoscope className="w-6 h-6" />, iconStyle: 'bg-red-100 text-red-600', action: () => onOpenFormIzinSakit('Sakit') },
    { id: 'riwayat', label: 'Riwayat', icon: <Calendar className="w-6 h-6" />, iconStyle: 'bg-purple-100 text-purple-600', action: () => onChangeTab('riwayat') },
    { id: 'rekap', label: 'Rekap', icon: <BarChart3 className="w-6 h-6" />, iconStyle: 'bg-indigo-100 text-indigo-600', action: () => onChangeTab('rekap') },
    { id: 'guru', label: 'Data Guru', icon: <Users className="w-6 h-6" />, iconStyle: 'bg-pink-100 text-pink-600', action: () => onChangeTab('guru') },
    { id: 'sekolah', label: 'Sekolah', icon: <School className="w-6 h-6" />, iconStyle: 'bg-teal-100 text-teal-600', action: () => onChangeTab('sekolah') },
  ];

  return (
    <div className="space-y-6 pb-20 sm:pb-8">

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: User Profile, Actions & Dark Summary Card */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          
          {/* Profile Card */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Halo, Selamat Pagi</p>
            <h2 className="text-xl font-extrabold text-[#1E293B]">
              {currentUser.nama}{currentUser.gelar ? `, ${currentUser.gelar}` : ''}
            </h2>
            <div className="inline-block px-3 py-1 bg-blue-50 text-[#2563EB] text-xs font-bold rounded-full mt-2">
              {currentUser.jabatan}
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-2xl">
                <div>
                  <p className="text-[10px] uppercase font-bold text-green-600 tracking-wider">Status Hari Ini</p>
                  <p className="text-base font-bold text-green-700 flex items-center gap-1 mt-0.5">
                    🟢 {todayRecord?.statusMasuk || 'BELUM ABSEN'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Jam Masuk</p>
                  <p className="text-base font-mono font-bold text-gray-700">
                    {todayRecord?.jamMasuk || '--:--'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={onOpenAbsenMasuk}
              className="w-full bg-[#22C55E] hover:bg-green-600 text-white py-4 sm:py-5 rounded-[20px] shadow-lg shadow-green-200 flex items-center justify-center gap-3 font-bold text-base sm:text-lg transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>Absen Masuk</span>
            </button>

            <button
              type="button"
              onClick={onOpenAbsenPulang}
              className="w-full bg-[#2563EB] hover:bg-blue-600 text-white py-4 sm:py-5 rounded-[20px] shadow-lg shadow-blue-200 flex items-center justify-center gap-3 font-bold text-base sm:text-lg transition-colors cursor-pointer"
            >
              <Clock className="w-6 h-6" />
              <span>Absen Pulang</span>
            </button>
          </div>

          {/* Dark Summary Micro Card */}
          <div className="bg-[#1E293B] text-white rounded-[24px] p-6 shadow-sm mt-auto">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Kehadiran Bulan Ini</p>
                <p className="text-3xl font-light"><span className="font-bold">{rekap.persentaseKehadiran}</span>%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#22C55E] font-bold mb-1">{rekap.totalHadir} Hari</p>
                <div className="w-28 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#22C55E] transition-all duration-700"
                    style={{ width: `${rekap.persentaseKehadiran}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Menu Grid & Detailed Statistics */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          
          {/* Quick Menu Grid */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Menu Utama PresensiKu</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {menuGrid.map(item => (
                <div
                  key={item.id}
                  onClick={item.action}
                  className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:bg-blue-50 cursor-pointer group transition-colors"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${item.iconStyle}`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide text-[#1E293B]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Statistics Summary Card */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-[#1E293B]">Statistik Kehadiran Juli 2026</h3>
                <p className="text-xs text-gray-500">Rekapitulasi resmi presensi digital {sekolah.namaSekolah}</p>
              </div>
              <button
                type="button"
                onClick={onGenerateSlip}
                className="text-[#2563EB] text-xs font-bold flex items-center gap-1.5 hover:underline bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-100"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Slip PDF</span>
              </button>
            </div>

            <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-3xl font-extrabold text-[#2563EB]">{rekap.totalHadir}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Hadir</p>
              </div>
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-3xl font-extrabold text-orange-500">{rekap.totalIzin}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Izin</p>
              </div>
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-3xl font-extrabold text-red-500">{rekap.totalSakit}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Sakit</p>
              </div>
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-3xl font-extrabold text-gray-400">{rekap.totalAlpa}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Alpa</p>
              </div>
              <div className="flex flex-col items-center justify-center bg-red-50 rounded-2xl p-4 border border-red-100 col-span-2 sm:col-span-1">
                <p className="text-3xl font-extrabold text-red-600 underline">{rekap.totalTerlambatMenit}</p>
                <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest mt-1">Terlambat (m)</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#2563EB]"></div>
                  <span className="text-xs text-gray-500 font-medium">Sesuai Jadwal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-500 font-medium">Terlambat</span>
                </div>
              </div>
              <p className="text-xs font-mono text-gray-400">Ref: 240726-SDN1-00231</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
