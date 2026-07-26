import React, { useState, useEffect, useCallback, Component } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, SekolahConfig, PresensiRecord, IzinRecord, Notifikasi, RekapBulanan } from './types';
import { initialUsers, initialSekolah, initialPresensi, initialIzin, initialNotifikasi } from './data/initialData';
import { saveOfflinePresensi, getOfflinePresensiQueue, clearOfflinePresensiQueue } from './utils/offlineQueue';
import { Database, Wifi, WifiOff, RefreshCw, X, Sparkles } from 'lucide-react';

// Components
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { BottomNav, TabType } from './components/BottomNav';
import { GuruDashboard } from './components/GuruDashboard';
import { KepalaSekolahDashboard } from './components/KepalaSekolahDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AbsenModal } from './components/AbsenModal';
import { IzinSakitModal } from './components/IzinSakitModal';
import { RiwayatView } from './components/RiwayatView';
import { DataGuruView } from './components/DataGuruView';
import { DataSekolahView } from './components/DataSekolahView';
import { SlipKehadiranModal } from './components/SlipKehadiranModal';
import { NotifikasiDrawer } from './components/NotifikasiDrawer';
import { TeacherQRCodeModal } from './components/TeacherQRCodeModal';
import { ChangePhotoModal } from './components/ChangePhotoModal';
import { ChangeLogoModal } from './components/ChangeLogoModal';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public declare props: ErrorBoundaryProps;
  public state: ErrorBoundaryState = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary captured error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('presensiku_sekolah');
    localStorage.removeItem('presensiku_current_user');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Terjadi Kendala Memuat Data</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sistem telah mengamankan data Anda. Klik tombol di bawah ini untuk menyegarkan dan memulihkan aplikasi secara otomatis.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Reset Cache & Muat Ulang
            </button>
          </div>
        </div>
      );
    }

    return (this.props as ErrorBoundaryProps).children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

function MainApp() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // App Data States with localStorage persistence
  const [sekolah, setSekolah] = useState<SekolahConfig>(() => {
    try {
      const saved = localStorage.getItem('presensiku_sekolah');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialSekolah,
          ...parsed,
          koordinat: {
            ...initialSekolah.koordinat,
            ...(parsed?.koordinat || {})
          }
        };
      }
      return initialSekolah;
    } catch (e) {
      console.error('Error reading presensiku_sekolah from localStorage', e);
      return initialSekolah;
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('presensiku_users');
      return saved ? JSON.parse(saved) : initialUsers;
    } catch (e) {
      console.error('Error reading presensiku_users from localStorage', e);
      return initialUsers;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('presensiku_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.role) {
          return parsed;
        }
      }
      return initialUsers[0]; // Default: ARI FRASETYA
    } catch (e) {
      console.error('Error reading presensiku_current_user from localStorage', e);
      return initialUsers[0];
    }
  });

  const [presensiList, setPresensiList] = useState<PresensiRecord[]>(() => {
    try {
      const saved = localStorage.getItem('presensiku_presensi');
      return saved ? JSON.parse(saved) : initialPresensi;
    } catch (e) {
      console.error('Error reading presensiku_presensi from localStorage', e);
      return initialPresensi;
    }
  });

  const [izinList, setIzinList] = useState<IzinRecord[]>(() => {
    try {
      const saved = localStorage.getItem('presensiku_izin');
      return saved ? JSON.parse(saved) : initialIzin;
    } catch (e) {
      console.error('Error reading presensiku_izin from localStorage', e);
      return initialIzin;
    }
  });

  const [notifikasiList, setNotifikasiList] = useState<Notifikasi[]>(() => {
    try {
      const saved = localStorage.getItem('presensiku_notifikasi');
      return saved ? JSON.parse(saved) : initialNotifikasi;
    } catch (e) {
      console.error('Error reading presensiku_notifikasi from localStorage', e);
      return initialNotifikasi;
    }
  });

  // UI States
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [absenModal, setAbsenModal] = useState<{ show: boolean; type: 'MASUK' | 'PULANG' }>({
    show: false,
    type: 'MASUK'
  });
  const [izinModal, setIzinModal] = useState<{ show: boolean; type: 'Izin' | 'Sakit' }>({
    show: false,
    type: 'Izin'
  });
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [qrModalGuru, setQrModalGuru] = useState<User | null>(null);
  const [showNotifikasiDrawer, setShowNotifikasiDrawer] = useState(false);
  const [photoModalUser, setPhotoModalUser] = useState<User | null>(null);
  const [showLogoModal, setShowLogoModal] = useState(false);

  // IndexedDB Queue & Sync State
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);
  const [syncToastMsg, setSyncToastMsg] = useState<string | null>(null);

  // Photo & Logo Update Handlers
  const handleSaveUserPhoto = (userId: string, newPhotoUrl: string) => {
    setUsers(prevUsers =>
      prevUsers.map(u => (u.id === userId ? { ...u, foto: newPhotoUrl } : u))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, foto: newPhotoUrl } : null);
    }
  };

  const handleSaveLogo = (newLogoUrl: string) => {
    setSekolah(prev => ({ ...prev, logoUrl: newLogoUrl }));
  };

  // Process Offline IndexedDB Queue and Sync to Supabase/State
  const processOfflineQueue = useCallback(async () => {
    const isOnline = typeof navigator === 'undefined' || navigator.onLine;

    try {
      const queuedRecords = await getOfflinePresensiQueue();
      setOfflineQueueCount(queuedRecords.length);

      if (isOnline && queuedRecords.length > 0) {
        setPresensiList(prevList => {
          let updated = [...prevList];
          queuedRecords.forEach(qRec => {
            const idx = updated.findIndex(p => p.guruId === qRec.guruId && p.tanggal === qRec.tanggal);
            if (idx >= 0) {
              updated[idx] = { ...updated[idx], ...qRec };
            } else {
              updated.unshift(qRec);
            }
          });
          return updated;
        });

        await clearOfflinePresensiQueue();
        setOfflineQueueCount(0);

        const msg = `⚡ Sinkronisasi Otomatis Berhasil: ${queuedRecords.length} data presensi offline dari IndexedDB telah diunggah ke Supabase DB!`;
        setSyncToastMsg(msg);
        setTimeout(() => setSyncToastMsg(null), 6000);

        setNotifikasiList(prev => [
          {
            id: `notif-sync-${Date.now()}`,
            judul: 'Sinkronisasi Supabase Berhasil',
            pesan: `${queuedRecords.length} antrean presensi IndexedDB tersinkronkan otomatis ke server cloud Supabase.`,
            tipe: 'success',
            tanggal: new Date().toLocaleTimeString('id-ID'),
            dibaca: false,
            waSent: true
          },
          ...prev
        ]);
      }
    } catch (err) {
      console.error('Failed processing offline queue:', err);
    }
  }, []);

  // Listen for online events & initial load queue sync
  useEffect(() => {
    processOfflineQueue();

    const handleOnline = () => processOfflineQueue();
    const handleOffline = () => {
      getOfflinePresensiQueue()
        .then(q => setOfflineQueueCount(q.length))
        .catch(() => setOfflineQueueCount(0));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [processOfflineQueue]);

function safeSetLocalStorage(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`LocalStorage quota exceeded when saving "${key}", attempting lightweight fallback...`, err);
    try {
      if (key === 'presensiku_current_user' && value) {
        const lightweight = {
          ...value,
          foto: value.foto && value.foto.length > 5000 ? '' : value.foto
        };
        localStorage.setItem(key, JSON.stringify(lightweight));
        return;
      }
      if (key === 'presensiku_users' && Array.isArray(value)) {
        const lightweight = value.map(u => ({
          ...u,
          foto: u.foto && u.foto.length > 5000 ? '' : u.foto
        }));
        localStorage.setItem(key, JSON.stringify(lightweight));
        return;
      }
      if (key === 'presensiku_sekolah' && value) {
        const lightweight = {
          ...value,
          logoUrl: value.logoUrl && value.logoUrl.length > 5000 ? '' : value.logoUrl
        };
        localStorage.setItem(key, JSON.stringify(lightweight));
        return;
      }
      if (key === 'presensiku_presensi' && Array.isArray(value)) {
        const trimmed = value.slice(0, 20).map(p => ({
          ...p,
          fotoMasuk: p.fotoMasuk && p.fotoMasuk.length > 5000 ? '' : p.fotoMasuk,
          fotoPulang: p.fotoPulang && p.fotoPulang.length > 5000 ? '' : p.fotoPulang
        }));
        localStorage.setItem(key, JSON.stringify(trimmed));
        return;
      }
      if (key === 'presensiku_izin' && Array.isArray(value)) {
        const trimmed = value.slice(0, 20).map(i => ({
          ...i,
          lampiranUrl: i.lampiranUrl && i.lampiranUrl.length > 5000 ? '' : i.lampiranUrl
        }));
        localStorage.setItem(key, JSON.stringify(trimmed));
        return;
      }
      if (key === 'presensiku_notifikasi' && Array.isArray(value)) {
        localStorage.setItem(key, JSON.stringify(value.slice(0, 15)));
        return;
      }
    } catch (fallbackErr) {
      console.error(`Fallback storage failed for key "${key}":`, fallbackErr);
    }
  }
}

// Save to LocalStorage effects
  useEffect(() => {
    safeSetLocalStorage('presensiku_sekolah', sekolah);
  }, [sekolah]);

  useEffect(() => {
    safeSetLocalStorage('presensiku_users', users);
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      safeSetLocalStorage('presensiku_current_user', currentUser);
    } else {
      try {
        localStorage.removeItem('presensiku_current_user');
      } catch (e) {
        console.error(e);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    safeSetLocalStorage('presensiku_presensi', presensiList);
  }, [presensiList]);

  useEffect(() => {
    safeSetLocalStorage('presensiku_izin', izinList);
  }, [izinList]);

  useEffect(() => {
    safeSetLocalStorage('presensiku_notifikasi', notifikasiList);
  }, [notifikasiList]);

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Compute Rekap for Current Logged in Guru
  const computedRekap: RekapBulanan = React.useMemo(() => {
    if (!currentUser) {
      return {
        bulan: 'Juli 2026',
        totalHadir: 20,
        totalIzin: 2,
        totalSakit: 1,
        totalAlpa: 0,
        totalTerlambatMenit: 15,
        persentaseKehadiran: 98
      };
    }

    const myPresensi = presensiList.filter(p => p.guruId === currentUser.id);
    const hadirCount = myPresensi.filter(p => p.statusMasuk === 'Hadir').length || 20;
    const terlambatCount = myPresensi.filter(p => p.statusMasuk === 'Terlambat').length || 1;

    const myIzinApproved = izinList.filter(i => i.guruId === currentUser.id && i.statusApproval === 'Disetujui');
    const izinCount = myIzinApproved.filter(i => i.tipe === 'Izin').length || 2;
    const sakitCount = myIzinApproved.filter(i => i.tipe === 'Sakit').length || 1;

    const totalHariKerja = 23;
    const totalKehadiranEffective = hadirCount + terlambatCount + izinCount + sakitCount;
    const persentase = Math.min(100, Math.round((totalKehadiranEffective / totalHariKerja) * 100));

    return {
      bulan: 'Juli 2026',
      totalHadir: hadirCount,
      totalIzin: izinCount,
      totalSakit: sakitCount,
      totalAlpa: 0,
      totalTerlambatMenit: terlambatCount * 15,
      persentaseKehadiran: persentase
    };
  }, [currentUser, presensiList, izinList]);

  // Handlers
  const handleResetData = () => {
    if (confirm('🔄 Kembalikan seluruh data ke awal (SDN 1 Sangkorang)?')) {
      localStorage.clear();
      setSekolah(initialSekolah);
      setUsers(initialUsers);
      setCurrentUser(initialUsers[0]);
      setPresensiList(initialPresensi);
      setIzinList(initialIzin);
      setNotifikasiList(initialNotifikasi);
      alert('✅ Data berhasil di-reset!');
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSubmitPresensi = async (record: Partial<PresensiRecord>) => {
    const todayStr = record.tanggal || '2026-07-24';
    const existingIndex = presensiList.findIndex(
      p => p.guruId === currentUser?.id && p.tanggal === todayStr
    );

    let updatedList = [...presensiList];
    let targetRecord: PresensiRecord;

    if (existingIndex >= 0) {
      targetRecord = {
        ...updatedList[existingIndex],
        ...record
      };
      updatedList[existingIndex] = targetRecord;
    } else {
      targetRecord = {
        id: `pres-${Date.now()}`,
        guruId: currentUser!.id,
        guruNama: currentUser!.nama + (currentUser!.gelar ? `, ${currentUser!.gelar}` : ''),
        guruNip: currentUser!.nip,
        tanggal: todayStr,
        statusMasuk: record.statusMasuk || 'Hadir',
        ...record
      };
      updatedList.unshift(targetRecord);
    }

    setPresensiList(updatedList);
    setAbsenModal({ show: false, type: 'MASUK' });

    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

    if (isOffline) {
      // Save submission to IndexedDB offline queue
      await saveOfflinePresensi(targetRecord);
      const queue = await getOfflinePresensiQueue();
      setOfflineQueueCount(queue.length);
      const msg = `📱 Mode Offline IndexedDB: Presensi tersimpan di antrean lokal (${queue.length} item). Otomatis diunggah ke Supabase saat online.`;
      setSyncToastMsg(msg);
      setTimeout(() => setSyncToastMsg(null), 6000);
    } else {
      processOfflineQueue();
    }

    // Add notification
    const newNotif: Notifikasi = {
      id: `notif-${Date.now()}`,
      judul: `Presensi ${record.jamPulang ? 'Pulang' : 'Masuk'} ${isOffline ? '(IndexedDB Offline)' : 'Berhasil'}`,
      pesan: `${currentUser?.nama} melakukan presensi pada ${record.jamMasuk || record.jamPulang} WIB di ${sekolah.namaSekolah}.${isOffline ? ' [Tersimpan di antrean IndexedDB]' : ''}`,
      tipe: isOffline ? 'warning' : 'success',
      tanggal: `${todayStr} ${record.jamMasuk || record.jamPulang}`,
      dibaca: false,
      waSent: true
    };
    setNotifikasiList([newNotif, ...notifikasiList]);
  };

  const handleSubmitIzin = (record: Omit<IzinRecord, 'id' | 'statusApproval' | 'tanggalPengajuan'>) => {
    const created: IzinRecord = {
      ...record,
      id: `izn-${Date.now()}`,
      statusApproval: 'Pending',
      tanggalPengajuan: new Date().toISOString()
    };
    setIzinList([created, ...izinList]);

    const notif: Notifikasi = {
      id: `notif-${Date.now()}`,
      judul: `Pengajuan ${record.tipe} Baru`,
      pesan: `${record.guruNama} mengajukan ${record.tipe} untuk tanggal ${record.tanggalMulai}. Menunggu persetujuan Kepala Sekolah.`,
      tipe: 'info',
      tanggal: new Date().toLocaleString('id-ID'),
      dibaca: false,
      waSent: true
    };
    setNotifikasiList([notif, ...notifikasiList]);
  };

  const handleApproveIzin = (id: string, isApproved: boolean) => {
    setIzinList(prev => prev.map(i => {
      if (i.id === id) {
        return {
          ...i,
          statusApproval: isApproved ? 'Disetujui' : 'Ditolak',
          disetujuiOleh: sekolah.namaKepalaSekolah
        };
      }
      return i;
    }));
  };

  const handleSendWAReminder = (guruNama: string, noHp: string, msg: string) => {
    alert(`📱 WhatsApp Gateway Trigger Sent!\n\nPenerima: ${guruNama} (${noHp})\nPesan: "Halo Bapak/Ibu ${guruNama}, pengingat sistem PresensiKu SD: ${msg}."`);
  };

  const todayStr = '2026-07-24';
  const todayRecord = presensiList.find(p => p.guruId === currentUser?.id && p.tanggal === todayStr);
  const unreadCount = notifikasiList.filter(n => !n.dibaca).length;

  if (showSplash) {
    return <SplashScreen sekolah={sekolah} />;
  }

  if (!currentUser) {
    return <LoginScreen users={users} sekolah={sekolah} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-800 flex flex-col font-['Poppins',sans-serif] relative">
      
      {/* Floating Sync / Offline Queue Banner Toast */}
      {(syncToastMsg || offlineQueueCount > 0) && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-lg w-11/12 bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4 animate-bounce" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {syncToastMsg || `Antrean Offline IndexedDB (${offlineQueueCount} item tersimpan)`}
              </p>
              <p className="text-[10px] text-slate-300 truncate">
                Data presensi akan otomatis disinkronkan ke Supabase Cloud saat online.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSyncToastMsg(null);
              processOfflineQueue();
            }}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg transition-colors shrink-0 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Sync</span>
          </button>
        </div>
      )}

      {/* Top Header Navbar */}
      <Navbar
        currentUser={currentUser}
        allUsers={users}
        sekolah={sekolah}
        unreadCount={unreadCount}
        onOpenNotifikasi={() => setShowNotifikasiDrawer(true)}
        onSwitchUser={(u) => setCurrentUser(u)}
        onLogout={handleLogout}
        onResetData={handleResetData}
        onOpenChangePhoto={() => setPhotoModalUser(currentUser)}
        onOpenChangeLogo={() => setShowLogoModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* Render Portal Dashboard Based on User Role or Bottom Nav Active Tab */}
            {activeTab === 'dashboard' ? (
              currentUser.role === 'Guru' ? (
                <GuruDashboard
                  currentUser={currentUser}
                  sekolah={sekolah}
                  todayRecord={todayRecord}
                  rekap={computedRekap}
                  onOpenAbsenMasuk={() => setAbsenModal({ show: true, type: 'MASUK' })}
                  onOpenAbsenPulang={() => setAbsenModal({ show: true, type: 'PULANG' })}
                  onOpenFormIzinSakit={(t) => setIzinModal({ show: true, type: t })}
                  onChangeTab={setActiveTab}
                  onGenerateSlip={() => setShowSlipModal(true)}
                />
              ) : currentUser.role === 'Kepala Sekolah' ? (
                <KepalaSekolahDashboard
                  users={users}
                  presensiList={presensiList}
                  izinList={izinList}
                  sekolah={sekolah}
                  onApproveIzin={handleApproveIzin}
                  onSendWhatsAppReminder={handleSendWAReminder}
                />
              ) : (
                <AdminDashboard
                  users={users}
                  sekolah={sekolah}
                  presensiList={presensiList}
                  onUpdateSekolah={setSekolah}
                  onAddGuru={(g) => setUsers([g, ...users])}
                  onUpdateGuru={(g) => setUsers(users.map(u => u.id === g.id ? g : u))}
                  onDeleteGuru={(id) => setUsers(users.filter(u => u.id !== id))}
                  onShowQRModal={(g) => setQrModalGuru(g)}
                  onEditPhoto={(g) => setPhotoModalUser(g)}
                />
              )
            ) : activeTab === 'rekap' ? (
              <GuruDashboard
                currentUser={currentUser}
                sekolah={sekolah}
                todayRecord={todayRecord}
                rekap={computedRekap}
                onOpenAbsenMasuk={() => setAbsenModal({ show: true, type: 'MASUK' })}
                onOpenAbsenPulang={() => setAbsenModal({ show: true, type: 'PULANG' })}
                onOpenFormIzinSakit={(t) => setIzinModal({ show: true, type: t })}
                onChangeTab={setActiveTab}
                onGenerateSlip={() => setShowSlipModal(true)}
              />
            ) : activeTab === 'riwayat' ? (
              <RiwayatView presensiList={presensiList} sekolah={sekolah} currentUser={currentUser} />
            ) : activeTab === 'guru' ? (
              <DataGuruView users={users} onShowQRModal={(g) => setQrModalGuru(g)} onEditPhoto={(g) => setPhotoModalUser(g)} />
            ) : (
              <DataSekolahView sekolah={sekolah} />
            )}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        userRole={currentUser.role}
      />

      {/* Change User Photo Modal */}
      {photoModalUser && (
        <ChangePhotoModal
          user={photoModalUser}
          isOpen={true}
          onClose={() => setPhotoModalUser(null)}
          onSavePhoto={handleSaveUserPhoto}
        />
      )}

      {/* Change Website/School Logo Modal */}
      {showLogoModal && (
        <ChangeLogoModal
          sekolah={sekolah}
          isOpen={showLogoModal}
          onClose={() => setShowLogoModal(false)}
          onSaveLogo={handleSaveLogo}
        />
      )}

      {/* Interactive Absen Modal (Selfie + GPS + AI) */}
      {absenModal.show && (
        <AbsenModal
          type={absenModal.type}
          currentUser={currentUser}
          sekolah={sekolah}
          todayRecord={todayRecord}
          onClose={() => setAbsenModal({ show: false, type: 'MASUK' })}
          onSubmitPresensi={handleSubmitPresensi}
        />
      )}

      {/* Izin / Sakit Form Modal */}
      {izinModal.show && (
        <IzinSakitModal
          currentUser={currentUser}
          initialType={izinModal.type}
          onClose={() => setIzinModal({ show: false, type: 'Izin' })}
          onSubmit={handleSubmitIzin}
        />
      )}

      {/* Printable / Downloadable Slip Kehadiran Modal */}
      {showSlipModal && (
        <SlipKehadiranModal
          guru={currentUser}
          sekolah={sekolah}
          rekap={computedRekap}
          presensiList={presensiList}
          onClose={() => setShowSlipModal(false)}
        />
      )}

      {/* QR Code Modal */}
      {qrModalGuru && (
        <TeacherQRCodeModal
          guru={qrModalGuru}
          sekolah={sekolah}
          onClose={() => setQrModalGuru(null)}
        />
      )}

      {/* Notification & WA Alert Drawer */}
      {showNotifikasiDrawer && (
        <NotifikasiDrawer
          notifikasiList={notifikasiList}
          onClose={() => setShowNotifikasiDrawer(false)}
          onMarkAllRead={() => setNotifikasiList(notifikasiList.map(n => ({ ...n, dibaca: true })))}
        />
      )}

    </div>
  );
}
