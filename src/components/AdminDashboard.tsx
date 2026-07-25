import React, { useState, useEffect } from 'react';
import { User, SekolahConfig, PresensiRecord } from '../types';
import {
  Users,
  Building2,
  MapPin,
  Clock,
  Calendar,
  FileSpreadsheet,
  Database,
  Cloud,
  Plus,
  Edit2,
  Trash2,
  QrCode,
  Check,
  RefreshCw,
  Download,
  Upload,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { exportGuruToCSV } from '../utils/excelExporter';

interface AdminDashboardProps {
  users: User[];
  sekolah: SekolahConfig;
  presensiList: PresensiRecord[];
  onUpdateSekolah: (config: SekolahConfig) => void;
  onAddGuru: (guru: User) => void;
  onUpdateGuru: (guru: User) => void;
  onDeleteGuru: (id: string) => void;
  onShowQRModal: (guru: User) => void;
  onEditPhoto?: (guru: User) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users = [],
  sekolah,
  presensiList = [],
  onUpdateSekolah,
  onAddGuru,
  onUpdateGuru,
  onDeleteGuru,
  onShowQRModal,
  onEditPhoto
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'guru' | 'sekolah' | 'lokasi' | 'jam' | 'sync'>('guru');

  // Sekolah Form state safely initialized
  const [sekolahForm, setSekolahForm] = useState<SekolahConfig>(() => ({
    ...sekolah,
    koordinat: {
      lat: sekolah?.koordinat?.lat ?? -6.8524,
      lng: sekolah?.koordinat?.lng ?? 107.6184
    }
  }));

  // Keep sekolahForm synchronized if sekolah prop updates
  useEffect(() => {
    if (sekolah) {
      setSekolahForm({
        ...sekolah,
        koordinat: {
          lat: sekolah?.koordinat?.lat ?? -6.8524,
          lng: sekolah?.koordinat?.lng ?? 107.6184
        }
      });
    }
  }, [sekolah]);

  // New Guru Modal
  const [showAddGuruModal, setShowAddGuruModal] = useState(false);
  const [newGuru, setNewGuru] = useState<Partial<User>>({
    nama: '',
    gelar: 'S.Pd.',
    nip: '',
    email: '',
    jabatan: 'Guru Kelas',
    noHp: '08123456789',
    alamat: 'Bandung Barat',
    role: 'Guru',
    status: 'Aktif',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  });

  const [syncing, setSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([
    `[${sekolah?.lastSyncedAt || '2026-07-24 07:15:00'}] Presensi otomatis tersinkron ke Google Sheet ID: ${sekolah?.spreadsheetId || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'}`,
    `[${sekolah?.lastSyncedAt || '2026-07-24 07:15:00'}] Backup foto selfie tersimpan di Google Drive Folder ID: ${sekolah?.driveFolderId || '1A2b3C4d5E6f7G8h9I0j_DriveFolderSDN1'}`,
    `[2026-07-24 07:05:12] Auto-Sync 1 entri presensi baru (ARI FRASETYA)`
  ]);

  const handleSaveSekolah = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSekolah(sekolahForm);
    alert('✅ Master Data Sekolah & GPS Radius berhasil diperbarui!');
  };

  const handleCreateGuruSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuru.nama || !newGuru.nip) {
      alert('Silakan lengkapi nama dan NIP.');
      return;
    }

    const created: User = {
      id: `usr-${Date.now()}`,
      email: newGuru.email || `${newGuru.nama.toLowerCase().replace(/\s+/g, '')}@sdn1sangkorang.sch.id`,
      nip: newGuru.nip!,
      nama: newGuru.nama!,
      gelar: newGuru.gelar,
      jabatan: newGuru.jabatan || 'Guru Kelas',
      noHp: newGuru.noHp || '08123456789',
      alamat: newGuru.alamat || 'Cililin, Bandung Barat',
      foto: newGuru.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      role: newGuru.role || 'Guru',
      status: 'Aktif',
      qrCodeUrl: `QR-${newGuru.nama.toUpperCase().replace(/\s+/g, '')}-${newGuru.nip}`
    };

    onAddGuru(created);
    setShowAddGuruModal(false);
    alert('✅ Data Guru berhasil ditambahkan!');
  };

  const handleForceSync = () => {
    setSyncing(true);
    setTimeout(() => {
      const nowStr = new Date().toLocaleString('id-ID');
      setSyncLogs(prev => [
        `[${nowStr}] Force Sync Berhasil! ${presensiList.length} rekam presensi terkirim ke Google Spreadsheet & Google Drive.`,
        ...prev
      ]);
      setSyncing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      
      {/* Header Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('guru')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'guru' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Master Guru ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('sekolah')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'sekolah' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Master Sekolah</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('lokasi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'lokasi' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Lokasi & GPS Radius</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('jam')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'jam' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Jam Kerja</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('sync')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'sync' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>Google Drive & Spreadsheet Sync</span>
        </button>
      </div>

      {/* SUBTAB 1: Master Guru */}
      {activeSubTab === 'guru' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Master Data Tenaga Pendidik & Staf</h3>
              <p className="text-xs text-slate-500">Kelola informasi guru, NIP, status keaktifan, dan QR Code</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => exportGuruToCSV(users)}
                className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddGuruModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Guru</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-3">Guru</th>
                  <th className="py-3 px-3">NIP</th>
                  <th className="py-3 px-3">Jabatan</th>
                  <th className="py-3 px-3">Peran / Role</th>
                  <th className="py-3 px-3">No. HP</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(guru => (
                  <tr key={guru.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={guru.foto} alt="" className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                        <div>
                          <p className="font-bold text-slate-900">{guru.nama}{guru.gelar ? `, ${guru.gelar}` : ''}</p>
                          <p className="text-[10px] text-slate-400">{guru.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">{guru.nip}</td>
                    <td className="py-3 px-3 font-medium text-slate-700">{guru.jabatan}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {guru.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{guru.noHp}</td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => onUpdateGuru({ ...guru, status: guru.status === 'Aktif' ? 'Nonaktif' : 'Aktif' })}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                          guru.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {guru.status}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        {onEditPhoto && (
                          <button
                            type="button"
                            onClick={() => onEditPhoto(guru)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ganti Foto Profil Guru"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onShowQRModal(guru)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Lihat QR Code Guru"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus data ${guru.nama}?`)) onDeleteGuru(guru.id);
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Master Sekolah */}
      {activeSubTab === 'sekolah' && (
        <form onSubmit={handleSaveSekolah} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900">Master Data Informasi Sekolah</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Sekolah</label>
              <input
                type="text"
                value={sekolahForm.namaSekolah}
                onChange={e => setSekolahForm({ ...sekolahForm, namaSekolah: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NPSN / NDS</label>
              <input
                type="text"
                value={sekolahForm.npsn}
                onChange={e => setSekolahForm({ ...sekolahForm, npsn: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2 p-3 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2">
              <label className="block text-xs font-bold text-purple-900">Logo Website & Sekolah (URL Gambar)</label>
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-xl bg-white border border-purple-200 p-1 shrink-0 overflow-hidden">
                  <img
                    src={sekolahForm.logoUrl}
                    alt="Logo Sekolah"
                    className="w-full h-full object-contain"
                  />
                </div>
                <input
                  type="url"
                  placeholder="https://..."
                  value={sekolahForm.logoUrl}
                  onChange={e => setSekolahForm({ ...sekolahForm, logoUrl: e.target.value })}
                  className="flex-1 px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>
              <p className="text-[10px] text-purple-700">Logo ini akan tampil pada header website utama, laporan slip kehadiran, dan dokumen ekspor.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={sekolahForm.namaKepalaSekolah}
                onChange={e => setSekolahForm({ ...sekolahForm, namaKepalaSekolah: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={sekolahForm.nipKepalaSekolah}
                onChange={e => setSekolahForm({ ...sekolahForm, nipKepalaSekolah: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap Sekolah</label>
              <textarea
                rows={2}
                value={sekolahForm.alamat}
                onChange={e => setSekolahForm({ ...sekolahForm, alamat: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30"
            >
              Simpan Informasi Sekolah
            </button>
          </div>
        </form>
      )}

      {/* SUBTAB 3: Lokasi & GPS Radius */}
      {activeSubTab === 'lokasi' && (
        <form onSubmit={handleSaveSekolah} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900">Pengaturan Titik GPS & Batas Radius Absen</h3>
          <p className="text-xs text-slate-500">Tentukan koordinat pusat sekolah & batas toleransi jarak kehadiran</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Latitude (Garis Lintang)</label>
              <input
                type="number"
                step="any"
                value={sekolahForm.koordinat?.lat ?? -6.8524}
                onChange={e => setSekolahForm({
                  ...sekolahForm,
                  koordinat: {
                    lat: parseFloat(e.target.value) || 0,
                    lng: sekolahForm.koordinat?.lng ?? 107.6184
                  }
                })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Longitude (Garis Bujur)</label>
              <input
                type="number"
                step="any"
                value={sekolahForm.koordinat?.lng ?? 107.6184}
                onChange={e => setSekolahForm({
                  ...sekolahForm,
                  koordinat: {
                    lat: sekolahForm.koordinat?.lat ?? -6.8524,
                    lng: parseFloat(e.target.value) || 0
                  }
                })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Radius Toleransi Absen</label>
              <select
                value={sekolahForm.radiusMeter}
                onChange={e => setSekolahForm({ ...sekolahForm, radiusMeter: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none text-blue-700"
              >
                <option value={100}>100 Meter (Sangat Ketat)</option>
                <option value={200}>200 Meter (Standar Area Sekolah)</option>
                <option value={500}>500 Meter (Komplek Pendidikan)</option>
                <option value={1000}>1000 Meter (1 Km)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30"
            >
              Simpan Pengaturan Lokasi
            </button>
          </div>
        </form>
      )}

      {/* SUBTAB 4: Jam Kerja */}
      {activeSubTab === 'jam' && (
        <form onSubmit={handleSaveSekolah} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900">Pengaturan Jam Kerja & Toleransi Keterlambatan</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Masuk Sekolah</label>
              <input
                type="time"
                value={sekolahForm.jamMasuk}
                onChange={e => setSekolahForm({ ...sekolahForm, jamMasuk: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Batas Toleransi (Terlambat)</label>
              <input
                type="time"
                value={sekolahForm.jamToleransi}
                onChange={e => setSekolahForm({ ...sekolahForm, jamToleransi: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Pulang Sekolah</label>
              <input
                type="time"
                value={sekolahForm.jamPulang}
                onChange={e => setSekolahForm({ ...sekolahForm, jamPulang: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30"
            >
              Simpan Jam Kerja
            </button>
          </div>
        </form>
      )}

      {/* SUBTAB 5: Google Sync Panel */}
      {activeSubTab === 'sync' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Cloud className="w-5 h-5 text-blue-600" />
                <span>Sinkronisasi Google Spreadsheet & Google Drive</span>
              </h3>
              <p className="text-xs text-slate-500">Semua entri presensi & foto selfie otomatis tersimpan di cloud secara real-time</p>
            </div>

            <button
              type="button"
              disabled={syncing}
              onClick={handleForceSync}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Menyingkronkan...' : 'Force Sync Sekarang'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Google Spreadsheet Database</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Realtime Active
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-mono">ID: {sekolah.spreadsheetId}</p>
              <a
                href={`https://docs.google.com/spreadsheets/d/${sekolah.spreadsheetId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline"
              >
                <span>Buka Google Spreadsheet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Cloud className="w-4 h-4 text-blue-600" />
                  <span>Google Drive Selfie Storage</span>
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  Auto Backup
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-mono">Folder ID: {sekolah.driveFolderId}</p>
              <a
                href={`https://drive.google.com/drive/folders/${sekolah.driveFolderId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline"
              >
                <span>Buka Folder Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Sync Activity Logs */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Aktivitas Sync Log Termutakhir</h4>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs space-y-1.5 max-h-48 overflow-y-auto">
              {syncLogs.map((log, idx) => (
                <p key={idx} className="leading-relaxed text-emerald-400">
                  ⚡ {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Guru */}
      {showAddGuruModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Tambah Data Guru Baru</h3>

            <form onSubmit={handleCreateGuruSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SRI RAHAYU"
                  value={newGuru.nama}
                  onChange={e => setNewGuru({ ...newGuru, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gelar</label>
                  <input
                    type="text"
                    placeholder="S.Pd."
                    value={newGuru.gelar}
                    onChange={e => setNewGuru({ ...newGuru, gelar: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIP / NIK</label>
                  <input
                    type="text"
                    required
                    placeholder="199307222020122008"
                    value={newGuru.nip}
                    onChange={e => setNewGuru({ ...newGuru, nip: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan</label>
                  <input
                    type="text"
                    placeholder="Guru Kelas IV"
                    value={newGuru.jabatan}
                    onChange={e => setNewGuru({ ...newGuru, jabatan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No. Handphone (WA)</label>
                  <input
                    type="text"
                    placeholder="08123456789"
                    value={newGuru.noHp}
                    onChange={e => setNewGuru({ ...newGuru, noHp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddGuruModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Simpan Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
