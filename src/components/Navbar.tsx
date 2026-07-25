import React, { useState, useEffect } from 'react';
import { User, SekolahConfig, UserRole } from '../types';
import { Cloud, Bell, LogOut, ChevronDown, RefreshCw, UserCheck, Camera, Database, Wifi, WifiOff, Image as ImageIcon } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  allUsers: User[];
  sekolah: SekolahConfig;
  unreadCount: number;
  onOpenNotifikasi: () => void;
  onSwitchUser: (user: User) => void;
  onLogout: () => void;
  onResetData: () => void;
  onOpenChangePhoto: () => void;
  onOpenChangeLogo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  sekolah,
  unreadCount,
  onOpenNotifikasi,
  onSwitchUser,
  onLogout,
  onResetData,
  onOpenChangePhoto,
  onOpenChangeLogo
}) => {
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);
  const [isDbOnline, setIsDbOnline] = useState(true);
  const [showDbInfo, setShowDbInfo] = useState(false);

  // Monitor real network online/offline status
  useEffect(() => {
    const handleOnline = () => setIsDbOnline(true);
    const handleOffline = () => setIsDbOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (typeof navigator !== 'undefined') {
      setIsDbOnline(navigator.onLine);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Live formatted current time and date
  const nowStr = new Date('2026-07-24T08:45:12').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const roleColors: Record<UserRole, string> = {
    'Guru': 'bg-blue-50 text-[#2563EB] border-blue-200',
    'Kepala Sekolah': 'bg-purple-50 text-purple-700 border-purple-200',
    'Operator': 'bg-teal-50 text-teal-700 border-teal-200',
    'Admin': 'bg-amber-50 text-amber-700 border-amber-200'
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand Logo & School Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {sekolah.logoUrl ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs p-0.5 shrink-0">
                <img
                  src={sekolah.logoUrl}
                  alt={sekolah.namaSekolah}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to default icon if image load fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="bg-[#2563EB] w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                <Cloud className="w-6 h-6" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-xl text-[#2563EB] tracking-tight truncate">PresensiKu SD</span>
                <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 hidden sm:inline-block ${roleColors[currentUser.role]}`}>
                  {currentUser.role}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold truncate">{sekolah.namaSekolah}</p>
            </div>
          </div>

          {/* Center Connectivity Status Badge (Supabase DB) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDbInfo(!showDbInfo)}
              title="Klik untuk melihat detail koneksi database"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                isDbOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isDbOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <Database className="w-3.5 h-3.5 hidden xs:inline" />
              <span className="hidden sm:inline">Supabase DB:</span>
              <span className="font-extrabold">{isDbOnline ? 'Online' : 'Offline Mode'}</span>
            </button>

            {/* Supabase Connectivity Tooltip / Popup */}
            {showDbInfo && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2 font-bold text-[#1E293B]">
                    <Database className="w-4 h-4 text-[#2563EB]" />
                    <span>Status Supabase Database</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDbInfo(false)}
                    className="text-gray-400 hover:text-gray-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                    <span className="text-gray-500 font-medium">Status Server</span>
                    <span className={`font-bold flex items-center gap-1 ${isDbOnline ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {isDbOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                      {isDbOnline ? 'Terhubung (Cloud)' : 'Mode Lokal (Offline)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                    <span className="text-gray-500 font-medium">Penyimpanan Lokal</span>
                    <span className="font-bold text-blue-600">Terbuka & Sinkron</span>
                  </div>

                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    {isDbOnline
                      ? 'Aplikasi terhubung langsung ke database cloud Supabase & Spreadsheet. Data tersimpan secara real-time.'
                      : 'Koneksi internet tidak terdeteksi. Aplikasi beralih ke Mode Lokal offline (Data disimpan sementara di browser & disinkronkan saat online).'}
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsDbOnline(!isDbOnline)}
                    className="w-full py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] rounded-xl transition-colors"
                  >
                    Simulasi {isDbOnline ? 'Switch to Offline Mode' : 'Switch to Online Cloud'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Date & User Profile */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            <div className="text-right hidden xl:block">
              <p className="text-xs font-bold text-[#1E293B]">{nowStr}</p>
              <p className="text-[11px] text-gray-500 font-mono font-medium">08:45:12 WIB</p>
            </div>

            {/* Reset Demo Data Button */}
            <button
              type="button"
              onClick={onResetData}
              title="Reset Data Demo Ke Awal"
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors hidden md:flex items-center gap-1.5 text-xs font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={onOpenNotifikasi}
              className="relative p-2 text-gray-600 hover:text-[#2563EB] hover:bg-blue-50 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSwitchMenu(!showSwitchMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="w-9 h-9 rounded-full bg-gray-200 border-2 border-white shadow-xs overflow-hidden shrink-0">
                  <img
                    src={currentUser.foto}
                    alt={currentUser.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left hidden lg:block pr-1">
                  <p className="text-xs font-bold text-[#1E293B] line-clamp-1">{currentUser.nama.split(',')[0]}</p>
                  <p className="text-[10px] text-gray-500 line-clamp-1">{currentUser.jabatan}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 pr-1" />
              </button>

              {showSwitchMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-[20px] shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-xs font-bold text-[#1E293B]">{currentUser.nama}</p>
                    <p className="text-[11px] font-mono text-gray-500">{currentUser.nip}</p>
                    <p className="text-[10px] font-semibold text-[#2563EB] mt-0.5">{currentUser.email}</p>
                  </div>

                  {/* Actions for Profile Photo & Website Logo */}
                  <div className="p-2 border-b border-gray-100 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSwitchMenu(false);
                        onOpenChangePhoto();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-[#2563EB] rounded-xl transition-colors text-left"
                    >
                      <Camera className="w-4 h-4 text-[#2563EB]" />
                      <span>Ganti Foto Profil</span>
                    </button>

                    {currentUser.role === 'Admin' && onOpenChangeLogo && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowSwitchMenu(false);
                          onOpenChangeLogo();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors text-left"
                      >
                        <ImageIcon className="w-4 h-4 text-purple-600" />
                        <span>Ganti Logo Website</span>
                      </button>
                    )}
                  </div>

                  <div className="px-3 py-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                      Ganti Peran Demo:
                    </span>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {allUsers.map(u => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            onSwitchUser(u);
                            setShowSwitchMenu(false);
                          }}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-left transition-colors ${
                            u.id === currentUser.id
                              ? 'bg-blue-50 text-[#2563EB] font-bold'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <img src={u.foto} alt="" className="w-6 h-6 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="line-clamp-1 font-semibold">{u.nama}</p>
                            <span className="text-[9px] text-gray-400 block line-clamp-1">{u.role} - {u.jabatan}</span>
                          </div>
                          {u.id === currentUser.id && <UserCheck className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 mt-1 pt-1 px-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSwitchMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

