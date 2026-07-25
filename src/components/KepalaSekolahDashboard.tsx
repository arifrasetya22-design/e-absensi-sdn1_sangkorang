import React from 'react';
import { User, PresensiRecord, IzinRecord, SekolahConfig } from '../types';
import {
  Users,
  UserCheck,
  FileEdit,
  Stethoscope,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart2,
  PieChart as PieChartIcon,
  MessageCircle,
  ShieldCheck,
  Search
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface KepalaSekolahDashboardProps {
  users: User[];
  presensiList: PresensiRecord[];
  izinList: IzinRecord[];
  sekolah: SekolahConfig;
  onApproveIzin: (id: string, isApproved: boolean) => void;
  onSendWhatsAppReminder: (guruNama: string, noHp: string, statusMsg: string) => void;
}

export const KepalaSekolahDashboard: React.FC<KepalaSekolahDashboardProps> = ({
  users,
  presensiList,
  izinList,
  sekolah,
  onApproveIzin,
  onSendWhatsAppReminder
}) => {
  const gurusOnly = users.filter(u => u.role === 'Guru');
  const totalGuru = gurusOnly.length;

  const todayStr = '2026-07-24';
  const todayPresensi = presensiList.filter(p => p.tanggal === todayStr);

  const totalHadirHariIni = todayPresensi.filter(p => p.statusMasuk === 'Hadir').length;
  const totalTerlambatHariIni = todayPresensi.filter(p => p.statusMasuk === 'Terlambat').length;

  const todayIzin = izinList.filter(i => i.tanggalMulai <= todayStr && i.tanggalSelesai >= todayStr && i.tipe === 'Izin' && i.statusApproval === 'Disetujui').length;
  const todaySakit = izinList.filter(i => i.tanggalMulai <= todayStr && i.tanggalSelesai >= todayStr && i.tipe === 'Sakit' && i.statusApproval === 'Disetujui').length;

  const pendingIzinList = izinList.filter(i => i.statusApproval === 'Pending');

  // Chart Data
  const barData = [
    { name: 'Senin', Hadir: 6, Terlambat: 0, Izin: 1, Sakit: 0 },
    { name: 'Selasa', Hadir: 7, Terlambat: 0, Izin: 0, Sakit: 0 },
    { name: 'Rabu', Hadir: 6, Terlambat: 1, Izin: 0, Sakit: 0 },
    { name: 'Kamis', Hadir: 7, Terlambat: 0, Izin: 0, Sakit: 0 },
    { name: 'Jumat (Hari ini)', Hadir: totalHadirHariIni, Terlambat: totalTerlambatHariIni, Izin: todayIzin, Sakit: todaySakit },
  ];

  const pieData = [
    { name: 'Hadir', value: totalHadirHariIni || 5, color: '#22C55E' },
    { name: 'Terlambat', value: totalTerlambatHariIni || 1, color: '#A855F7' },
    { name: 'Izin', value: todayIzin || 1, color: '#3B82F6' },
    { name: 'Sakit', value: todaySakit || 1, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      
      {/* Principal Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <ShieldCheck className="w-8 h-8 text-purple-300" />
          </div>
          <div>
            <p className="text-purple-200 text-xs font-semibold uppercase tracking-wider">Portal Monitoring Kepala Sekolah</p>
            <h2 className="text-xl font-extrabold">{sekolah.namaSekolah}</h2>
            <p className="text-xs text-purple-200/80">Kepala Sekolah: {sekolah.namaKepalaSekolah} ({sekolah.nipKepalaSekolah})</p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Guru</span>
            <span className="text-xl font-black text-slate-800 block">{totalGuru}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Hadir Hari Ini</span>
            <span className="text-xl font-black text-emerald-600 block">{totalHadirHariIni}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Terlambat</span>
            <span className="text-xl font-black text-purple-600 block">{totalTerlambatHariIni}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileEdit className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Izin</span>
            <span className="text-xl font-black text-indigo-600 block">{todayIzin}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sakit</span>
            <span className="text-xl font-black text-amber-600 block">{todaySakit}</span>
          </div>
        </div>

      </div>

      {/* Pending Leave Approvals Panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Persetujuan Surat Izin / Sakit ({pendingIzinList.length})</h3>
            <p className="text-xs text-slate-500">Permohonan pending yang membutuhkan verifikasi Kepala Sekolah</p>
          </div>
          {pendingIzinList.length > 0 && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full animate-pulse">
              Membutuhkan Tindakan
            </span>
          )}
        </div>

        {pendingIzinList.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
            <p className="text-xs font-semibold text-slate-700">Semua pengajuan izin/sakit telah diproses.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingIzinList.map(izn => (
              <div key={izn.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{izn.guruNama}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${izn.tipe === 'Izin' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                      {izn.tipe}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600"><strong>NIP:</strong> {izn.guruNip} | <strong>Periode:</strong> {izn.tanggalMulai} s/d {izn.tanggalSelesai}</p>
                  <p className="text-xs text-slate-700 italic">"{izn.alasan}"</p>
                  {izn.dokumenUrl && (
                    <a href={izn.dokumenUrl} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 font-semibold hover:underline block">
                      📷 Lihat Lampiran Dokumen
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onApproveIzin(izn.id, false)}
                    className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tolak</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onApproveIzin(izn.id, true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Setujui</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attendance Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-600" />
                <span>Grafik Kehadiran Mingguan</span>
              </h3>
              <p className="text-xs text-slate-500">Tren presensi guru per hari</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="Hadir" fill="#22C55E" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Terlambat" fill="#A855F7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Izin" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Sakit" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
              <PieChartIcon className="w-4 h-4 text-indigo-600" />
              <span>Persentase Hari Ini</span>
            </h3>
            <p className="text-xs text-slate-500">Distribusi status guru</p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Teacher Live Attendance Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Daftar Presensi Guru Hari Ini</h3>
            <p className="text-xs text-slate-500">Pemantauan real-time foto selfie, waktu & koordinat GPS</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-3">Foto</th>
                <th className="py-3 px-3">Nama Guru / NIP</th>
                <th className="py-3 px-3">Jam Masuk</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Lokasi GPS</th>
                <th className="py-3 px-3">Aksi WA Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gurusOnly.map(guru => {
                const rec = todayPresensi.find(p => p.guruId === guru.id);

                return (
                  <tr key={guru.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3">
                      <img
                        src={rec?.fotoSelfieMasuk || guru.foto}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-800">{guru.nama}{guru.gelar ? `, ${guru.gelar}` : ''}</p>
                      <p className="text-[10px] text-slate-500">{guru.jabatan} • {guru.nip}</p>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">
                      {rec?.jamMasuk ? `${rec.jamMasuk} WIB` : 'Belum Absen'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        rec?.statusMasuk === 'Hadir' ? 'bg-emerald-100 text-emerald-800' :
                        rec?.statusMasuk === 'Terlambat' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {rec?.statusMasuk || 'Belum Absen'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      {rec?.lokasiMasuk ? (
                        <span>📍 {rec.lokasiMasuk.jarakMeter}m dari sekolah</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        type="button"
                        onClick={() => onSendWhatsAppReminder(
                          guru.nama,
                          guru.noHp,
                          rec?.jamMasuk ? `Presensi Masuk jam ${rec.jamMasuk} WIB` : 'Pengingat Belum Absen'
                        )}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kirim WA</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
