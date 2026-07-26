import React, { useState } from 'react';
import { UserRole, User, SekolahConfig } from '../types';
import { Cloud, Lock, Mail, ShieldCheck, UserCheck, KeyRound, Building2 } from 'lucide-react';

interface LoginScreenProps {
  users: User[];
  sekolah?: SekolahConfig;
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ users, sekolah, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Guru');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { role: 'Guru', label: 'Guru', icon: <UserCheck className="w-5 h-5" />, desc: 'Absen GPS & Selfie' },
    { role: 'Kepala Sekolah', label: 'Kepala Sekolah', icon: <ShieldCheck className="w-5 h-5" />, desc: 'Monitoring & Approval' },
    { role: 'Operator', label: 'Operator', icon: <Building2 className="w-5 h-5" />, desc: 'Pengelolaan Data' },
    { role: 'Admin', label: 'Admin', icon: <KeyRound className="w-5 h-5" />, desc: 'Akses Master Sistem' }
  ];

  const handleRoleSelect = (r: UserRole) => {
    setSelectedRole(r);
    setErrorMsg('');
    // Auto populate sample credentials for convenience
    if (r === 'Guru') {
      setIdentifier('198804122015031002');
      setPassword('password');
    } else if (r === 'Kepala Sekolah') {
      setIdentifier('196805101992031004');
      setPassword('password');
    } else if (r === 'Operator') {
      setIdentifier('199402182019022001');
      setPassword('password');
    } else if (r === 'Admin') {
      setIdentifier('199001012015011001');
      setPassword('password');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmed = identifier.trim().toLowerCase();
    if (!trimmed) {
      setErrorMsg(`Masukkan ${selectedRole === 'Guru' ? 'NIP (Nomor Induk Pegawai) atau Email Guru' : 'Email / NIP / NIK'} Anda.`);
      return;
    }

    if (!password) {
      setErrorMsg('Masukkan Password akun Anda.');
      return;
    }

    // Specialized authentication handling for 'Guru' role
    if (selectedRole === 'Guru') {
      const guruUser = users.find(
        u => (u.nip.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed) && u.role === 'Guru'
      );

      if (!guruUser) {
        // Check if user exists under a different role
        const nonGuruUser = users.find(u => u.nip.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed);
        if (nonGuruUser) {
          setErrorMsg(`Akun '${nonGuruUser.nama}' terdaftar sebagai role '${nonGuruUser.role}'. Silakan klik tab '${nonGuruUser.role}' di atas untuk masuk.`);
        } else {
          setErrorMsg('NIP / Email atau Password Guru tidak ditemukan. Silakan periksa kembali data Anda atau hubungi Operator Sekolah.');
        }
        return;
      }

      // Check Guru account status
      if (guruUser.status !== 'Aktif') {
        setErrorMsg(`Akun Guru '${guruUser.nama}' saat ini berstatus ${guruUser.status}. Silakan hubungi Operator Sekolah untuk mengaktifkan akun.`);
        return;
      }

      // Successful Guru Authentication -> Proceed to Guru Dashboard
      onLogin(guruUser);
      return;
    }

    // General authentication for other roles (Kepala Sekolah, Operator, Admin)
    const foundUser = users.find(
      u => (u.nip.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed) && u.role === selectedRole
    );

    if (!foundUser) {
      const anyUser = users.find(u => u.nip.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed);
      if (anyUser) {
        setErrorMsg(`Akun ini terdaftar sebagai role '${anyUser.role}'. Silakan pilih tab '${anyUser.role}' di atas.`);
      } else {
        setErrorMsg('Email / NIP atau Password salah. Silakan periksa kembali data Anda.');
      }
      return;
    }

    if (foundUser.status !== 'Aktif') {
      setErrorMsg(`Akun '${foundUser.nama}' saat ini berstatus ${foundUser.status}. Silakan hubungi Admin.`);
      return;
    }

    onLogin(foundUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 opacity-10">
            <Cloud className="w-48 h-48" />
          </div>
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md mb-3 border border-white/20 shadow-lg p-2 overflow-hidden">
            {sekolah?.logoUrl ? (
              <img
                src={sekolah.logoUrl}
                alt={sekolah.namaSekolah}
                className="w-full h-full object-contain drop-shadow"
              />
            ) : (
              <Cloud className="w-10 h-10 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">PresensiKu <span className="text-emerald-400">SD</span></h1>
          <p className="text-blue-100 text-xs mt-1">Sistem Presensi Digital Sekolah Dasar – {sekolah?.namaSekolah || 'SDN 1 Sangkorang'}</p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Pilih Peran / Akses Login
          </label>

          {/* Role Choice Grid */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {roles.map(r => {
              const isSelected = selectedRole === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleRoleSelect(r.role)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-sm ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg mb-1.5 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {r.icon}
                  </div>
                  <span className="font-semibold text-xs">{r.label}</span>
                  <span className="text-[10px] text-slate-500 line-clamp-1">{r.desc}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {selectedRole === 'Guru' && (
              <div className="p-3 bg-blue-50/90 border border-blue-200 text-blue-900 text-xs rounded-xl flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Akses Demo Guru</span>
                  <span className="text-[11px] text-blue-700 block">NIP: <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold">198804122015031002</code> | Password: <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold">password</code></span>
                </div>
              </div>
            )}

            {selectedRole === 'Kepala Sekolah' && (
              <div className="p-3 bg-indigo-50/90 border border-indigo-200 text-indigo-900 text-xs rounded-xl flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Akses Demo Kepala Sekolah</span>
                  <span className="text-[11px] text-indigo-700 block">NIP: <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono font-bold">196805101992031004</code> | Password: <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono font-bold">password</code></span>
                </div>
              </div>
            )}

            {selectedRole === 'Operator' && (
              <div className="p-3 bg-amber-50/90 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Akses Demo Operator Sekolah</span>
                  <span className="text-[11px] text-amber-800 block">NIP: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">199402182019022001</code> | Password: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">password</code></span>
                </div>
              </div>
            )}

            {selectedRole === 'Admin' && (
              <div className="p-3 bg-purple-50/90 border border-purple-200 text-purple-900 text-xs rounded-xl flex items-start gap-2.5">
                <KeyRound className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Akses Demo Administrator Master</span>
                  <span className="text-[11px] text-purple-800 block">NIP: <code className="bg-purple-100 px-1 py-0.5 rounded font-mono font-bold">199001012015011001</code> | Password: <code className="bg-purple-100 px-1 py-0.5 rounded font-mono font-bold">password</code></span>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <span>⚠️ {errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {selectedRole === 'Guru' ? 'NIP (Nomor Induk Pegawai) / Email Guru' : 'Email atau NIP / NIK'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder={selectedRole === 'Guru' ? 'Contoh NIP: 198804122015031002' : 'Contoh: 198804122015031002'}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span>Ingat saya di perangkat ini</span>
              </label>
              <a href="#reset" onClick={e => { e.preventDefault(); alert('Silakan hubungi Operator Sekolah untuk reset password.'); }} className="text-blue-600 font-medium hover:underline">
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Masuk Aplikasi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
