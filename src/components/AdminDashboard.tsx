import React, { useState, useEffect } from 'react';
import { User, SekolahConfig, PresensiRecord, UserRole } from '../types';
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
  MessageCircle,
  Navigation,
  Loader2,
  Search,
  UserX,
  KeyRound,
  Key,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import { exportGuruToCSV } from '../utils/excelExporter';
import { MapView } from './MapView';
import { compressImageFile } from '../utils/imageCompressor';

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

  const [isCompressingLogo, setIsCompressingLogo] = useState(false);

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressingLogo(true);
        const compressedBase64 = await compressImageFile(file, 300, 300, 0.85);
        setSekolahForm(prev => ({ ...prev, logoUrl: compressedBase64 }));
      } catch (err: any) {
        alert(err.message || 'Gagal mengunggah gambar logo.');
      } finally {
        setIsCompressingLogo(false);
      }
    }
  };

  // Search & Filter state for Master Guru
  const [guruSearch, setGuruSearch] = useState('');
  const [guruStatusFilter, setGuruStatusFilter] = useState<'Semua' | 'Aktif' | 'Nonaktif'>('Semua');
  const [guruRoleFilter, setGuruRoleFilter] = useState<'Semua' | UserRole>('Semua');

  const filteredUsers = users.filter(user => {
    const term = guruSearch.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (user.nama || '').toLowerCase().includes(term) ||
      (user.nip || '').includes(term) ||
      (user.email || '').toLowerCase().includes(term) ||
      (user.jabatan || '').toLowerCase().includes(term);

    const matchesStatus = guruStatusFilter === 'Semua' || user.status === guruStatusFilter;
    const matchesRole = guruRoleFilter === 'Semua' || user.role === guruRoleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const totalNonaktifCount = users.filter(u => u.status === 'Nonaktif').length;
  const totalAktifCount = users.filter(u => u.status === 'Aktif').length;

  // Custom Modals & Toast State for User Deletion & Actions
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [showPasswordText, setShowPasswordText] = useState<boolean>(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => {
      setActionToast(null);
    }, 4500);
  };

  const handleDeleteAllNonAktif = () => {
    const nonAktifUsers = users.filter(u => u.status === 'Nonaktif');
    if (nonAktifUsers.length === 0) {
      triggerToast('ℹ️ Tidak ada user dengan status Nonaktif saat ini.');
      return;
    }
    setShowBulkDeleteModal(true);
  };

  // New Guru Modal
  const [showAddGuruModal, setShowAddGuruModal] = useState(false);
  const [newGuru, setNewGuru] = useState<Partial<User>>({
    nama: '',
    gelar: 'S.Pd.',
    nip: '',
    email: '',
    jabatan: 'Operator Sekolah',
    noHp: '08123456789',
    alamat: 'Bandung Barat',
    role: 'Operator',
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
              <p className="text-xs text-slate-500">Kelola informasi guru, NIP, status keaktifan, dan hapus user yang tidak aktif</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {totalNonaktifCount > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteAllNonAktif}
                  className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors shadow-xs"
                  title="Hapus sekaligus semua user berstatus Nonaktif"
                >
                  <UserX className="w-4 h-4 text-rose-600" />
                  <span>Hapus Semua Non-Aktif ({totalNonaktifCount})</span>
                </button>
              )}
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

          {/* Filter & Search Bar */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={guruSearch}
                onChange={e => setGuruSearch(e.target.value)}
                placeholder="Cari Nama Guru, NIP, Jabatan, atau Email..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter Pills */}
              <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setGuruStatusFilter('Semua')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    guruStatusFilter === 'Semua' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Semua ({users.length})
                </button>
                <button
                  type="button"
                  onClick={() => setGuruStatusFilter('Aktif')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    guruStatusFilter === 'Aktif' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Aktif ({totalAktifCount})
                </button>
                <button
                  type="button"
                  onClick={() => setGuruStatusFilter('Nonaktif')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    guruStatusFilter === 'Nonaktif' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Nonaktif ({totalNonaktifCount})
                </button>
              </div>

              {/* Role Filter */}
              <select
                value={guruRoleFilter}
                onChange={e => setGuruRoleFilter(e.target.value as any)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
              >
                <option value="Semua">Semua Role</option>
                <option value="Guru">Guru</option>
                <option value="Kepala Sekolah">Kepala Sekolah</option>
                <option value="Operator">Operator</option>
                <option value="Admin">Admin</option>
              </select>
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
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      <p className="font-semibold text-xs">Tidak ditemukan data user sesuai filter.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setGuruSearch('');
                          setGuruStatusFilter('Semua');
                          setGuruRoleFilter('Semua');
                        }}
                        className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Reset Filter
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(guru => (
                    <tr
                      key={guru.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        guru.status === 'Nonaktif' ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          {guru.foto ? (
                            <img src={guru.foto} alt="" className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center font-bold text-slate-600 border border-slate-200 text-xs shrink-0">
                              {guru.nama?.[0] || 'G'}
                            </div>
                          )}
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
                          onClick={() => {
                            const nextStatus = guru.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
                            onUpdateGuru({ ...guru, status: nextStatus });
                            triggerToast(`✅ Status keaktifan "${guru.nama}" diubah menjadi '${nextStatus}'.`);
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shadow-2xs flex items-center gap-1 ${
                            guru.status === 'Aktif'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                          }`}
                          title="Klik untuk mengubah status keaktifan (Aktif / Nonaktif)"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${guru.status === 'Aktif' ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                          <span>{guru.status}</span>
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
                              setUserToResetPassword(guru);
                              setNewPasswordInput(guru.password || 'password');
                              setShowPasswordText(false);
                            }}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Reset / Ganti Password User"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setUserToDelete(guru)}
                            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                              guru.status === 'Nonaktif'
                                ? 'text-rose-700 bg-rose-100 hover:bg-rose-200 border border-rose-300 font-bold text-[11px] px-2'
                                : 'text-rose-600 hover:bg-rose-50'
                            }`}
                            title={guru.status === 'Nonaktif' ? 'Hapus User Tidak Aktif Ini' : 'Hapus Data User'}
                          >
                            <Trash2 className="w-4 h-4" />
                            {guru.status === 'Nonaktif' && <span>Hapus</span>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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

            <div className="sm:col-span-2 p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-3">
              <label className="block text-xs font-bold text-purple-900">Logo Website & Sekolah (Upload File Gambar)</label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-purple-200 p-1.5 shrink-0 overflow-hidden flex items-center justify-center shadow-xs">
                  {sekolahForm.logoUrl ? (
                    <img
                      src={sekolahForm.logoUrl}
                      alt="Logo Sekolah"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-purple-400" />
                  )}
                </div>
                <div className="space-y-2 flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      id="sekolah-logo-file-input"
                      accept="image/*"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                      disabled={isCompressingLogo}
                    />
                    <label
                      htmlFor="sekolah-logo-file-input"
                      className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      {isCompressingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>{isCompressingLogo ? 'Memproses Logo...' : 'Pilih File Logo Baru (PNG/JPG)'}</span>
                    </label>
                  </div>
                  <p className="text-[10px] text-purple-700 font-medium">Logo yang diunggah akan otomatis dikompresi agar ringan dan muncul di seluruh header website, slip kehadiran, serta laporan.</p>
                </div>
              </div>
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
        <form onSubmit={handleSaveSekolah} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Pengaturan Tempat / Lokasi GPS & Radius Sekolah</h3>
              <p className="text-xs text-slate-500">Tentukan koordinat titik pusat gedung sekolah & radius toleransi kehadiran GPS</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      const lat = Number(pos.coords.latitude.toFixed(6));
                      const lng = Number(pos.coords.longitude.toFixed(6));
                      setSekolahForm(prev => ({
                        ...prev,
                        koordinat: { lat, lng }
                      }));
                      alert(`📍 Lokasi GPS Perangkat Dideteksi!\nLatitude: ${lat}\nLongitude: ${lng}`);
                    },
                    (err) => alert('Gagal mengambil lokasi GPS: ' + err.message),
                    { enableHighAccuracy: true }
                  );
                } else {
                  alert('Browser tidak mendukung Geolocation.');
                }
              }}
              className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl border border-blue-200 inline-flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Navigation className="w-4 h-4 text-blue-600" />
              <span>Deteksi Lokasi GPS Perangkat Ini</span>
            </button>
          </div>

          {/* Interactive Map view for setting location */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Peta Lokasi & Titik Pusat Sekolah</span>
              <span className="text-blue-600 font-medium">💡 Klik atau geser pada peta di bawah untuk menandai lokasi baru</span>
            </div>
            <MapView
              schoolLat={sekolahForm.koordinat?.lat ?? -6.8524}
              schoolLng={sekolahForm.koordinat?.lng ?? 107.6184}
              schoolName={sekolahForm.namaSekolah || 'Sekolah'}
              radiusMeter={sekolahForm.radiusMeter ?? 200}
              onSelectUserCoords={(lat, lng) => {
                setSekolahForm(prev => ({
                  ...prev,
                  koordinat: {
                    lat: Number(lat.toFixed(6)),
                    lng: Number(lng.toFixed(6))
                  }
                }));
              }}
              heightClass="h-72"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-blue-600 outline-none"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Radius Toleransi Absen (Meter)</label>
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Fisik / Lokasi Lengkap Sekolah</label>
            <textarea
              rows={2}
              value={sekolahForm.alamat}
              onChange={e => setSekolahForm({ ...sekolahForm, alamat: e.target.value })}
              placeholder="Contoh: Jl. Raya Pendidikan No. 45, Kecamatan Sangkorang..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
            />
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
                    placeholder="Staf Operator / Kepala Sekolah"
                    value={newGuru.jabatan}
                    onChange={e => setNewGuru({ ...newGuru, jabatan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Peran Akses</label>
                  <select
                    value={newGuru.role || 'Guru'}
                    onChange={e => setNewGuru({ ...newGuru, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="Guru">Guru</option>
                    <option value="Kepala Sekolah">Kepala Sekolah</option>
                    <option value="Operator">Operator</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
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

      {/* Floating Action Toast */}
      {actionToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span>{actionToast}</span>
          <button
            type="button"
            onClick={() => setActionToast(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Modal Confirm Delete Single User */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Hapus Data User Guru</h3>
                <p className="text-xs text-slate-500">Konfirmasi tindakan penghapusan permanen</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              {userToDelete.foto ? (
                <img src={userToDelete.foto} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                  {userToDelete.nama?.[0] || 'G'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{userToDelete.nama}{userToDelete.gelar ? `, ${userToDelete.gelar}` : ''}</p>
                <p className="text-[11px] text-slate-500 font-mono">NIP: {userToDelete.nip || '-'}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {userToDelete.role}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    userToDelete.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {userToDelete.status}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus user <strong>{userToDelete.nama}</strong> secara permanen? Seluruh akun & data terkait akan dihapus dari daftar master guru.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteGuru(userToDelete.id);
                  triggerToast(`✅ Data user "${userToDelete.nama}" telah berhasil dihapus secara permanen.`);
                  setUserToDelete(null);
                }}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Permanen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirm Bulk Delete Non-Aktif */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <UserX className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Hapus Semua User Non-Aktif</h3>
                <p className="text-xs text-slate-500">Pembersihan masal akun berstatus Nonaktif</p>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-2xl">
              <p className="font-bold">⚠️ Perhatian Hapus Masal:</p>
              <p className="mt-1">
                Tindakan ini akan menghapus <strong>{totalNonaktifCount} user</strong> yang berstatus Nonaktif sekaligus dari database sistem.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const nonAktifUsers = users.filter(u => u.status === 'Nonaktif');
                  nonAktifUsers.forEach(u => onDeleteGuru(u.id));
                  triggerToast(`✅ Berhasil menghapus ${nonAktifUsers.length} akun user tidak aktif.`);
                  setShowBulkDeleteModal(false);
                }}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus {totalNonaktifCount} User Nonaktif</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reset / Ganti Password User */}
      {userToResetPassword && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                <KeyRound className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Reset & Ganti Password</h3>
                <p className="text-xs text-slate-500">Ubah kredensial akses pengguna sistem</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              {userToResetPassword.foto ? (
                <img src={userToResetPassword.foto} alt="" className="w-11 h-11 rounded-xl object-cover border border-slate-200" />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  {userToResetPassword.nama?.[0] || 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{userToResetPassword.nama}</p>
                <p className="text-[11px] text-slate-500 font-mono">NIP / ID: {userToResetPassword.nip || '-'}</p>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {userToResetPassword.role}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password Baru</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Masukkan password baru..."
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setNewPasswordInput('password')}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset ke default ("password")</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setUserToResetPassword(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const updatedPass = newPasswordInput.trim() || 'password';
                  onUpdateGuru({
                    ...userToResetPassword,
                    password: updatedPass
                  });
                  triggerToast(`✅ Password untuk ${userToResetPassword.nama} berhasil diperbarui.`);
                  setUserToResetPassword(null);
                }}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md flex items-center gap-1.5"
              >
                <Key className="w-4 h-4" />
                <span>Simpan Password Baru</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
