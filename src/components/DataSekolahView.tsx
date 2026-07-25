import React from 'react';
import { SekolahConfig } from '../types';
import { School, MapPin, Phone, Mail, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { MapView } from './MapView';

interface DataSekolahViewProps {
  sekolah: SekolahConfig;
}

export const DataSekolahView: React.FC<DataSekolahViewProps> = ({ sekolah }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-6 pb-20 sm:pb-8">
      
      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
        {sekolah.logoUrl ? (
          <div className="w-16 h-16 rounded-2xl border border-slate-200 bg-white p-1 shadow-md shrink-0 overflow-hidden">
            <img src={sekolah.logoUrl} alt={sekolah.namaSekolah} className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shrink-0">
            <School className="w-8 h-8" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">{sekolah.namaSekolah}</h2>
          <p className="text-xs text-slate-500">NPSN: {sekolah.npsn} • Bandung Barat, Jawa Barat</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Info Box */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Informasi Profil Sekolah</h3>
            
            <div>
              <span className="text-slate-400 font-semibold block">Kepala Sekolah</span>
              <span className="font-bold text-slate-800 text-sm">{sekolah.namaKepalaSekolah}</span>
              <span className="text-slate-500 block">NIP. {sekolah.nipKepalaSekolah}</span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block">Alamat Lengkap</span>
              <span className="font-medium text-slate-700">{sekolah.alamat}</span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block">Jam Operasional Presensi</span>
              <span className="font-bold text-blue-700">Masuk {sekolah.jamMasuk} (Toleransi {sekolah.jamToleransi}) • Pulang {sekolah.jamPulang} WIB</span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block">Radius Kehadiran GPS Allowed</span>
              <span className="font-bold text-emerald-600">{sekolah.radiusMeter} Meter dari Titik Pusat Sekolah</span>
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Peta Lokasi & Lingkaran Radius Sekolah</span>
          </h3>

          <MapView
            schoolLat={sekolah.koordinat?.lat ?? -6.8524}
            schoolLng={sekolah.koordinat?.lng ?? 107.6184}
            schoolName={sekolah.namaSekolah || 'SDN 1 Sangkorang'}
            radiusMeter={sekolah.radiusMeter ?? 200}
            heightClass="h-64"
          />

          <p className="text-[11px] text-slate-500">
            📍 Koordinat GPS: {sekolah.koordinat?.lat ?? -6.8524}, {sekolah.koordinat?.lng ?? 107.6184}
          </p>
        </div>

      </div>

    </div>
  );
};
