export type UserRole = 'Guru' | 'Kepala Sekolah' | 'Operator' | 'Admin';

export type StatusPresensi = 'Hadir' | 'Terlambat' | 'Izin' | 'Sakit' | 'Alpa' | 'Belum Absen';

export interface User {
  id: string;
  email: string;
  nip: string;
  nama: string;
  gelar?: string;
  jabatan: string;
  noHp: string;
  alamat: string;
  foto: string;
  role: UserRole;
  status: 'Aktif' | 'Nonaktif';
  qrCodeUrl?: string;
}

export interface PresensiRecord {
  id: string;
  guruId: string;
  guruNama: string;
  guruNip: string;
  tanggal: string; // YYYY-MM-DD
  jamMasuk?: string; // HH:mm:ss
  jamPulang?: string; // HH:mm:ss
  statusMasuk: StatusPresensi;
  statusPulang?: string;
  durasiKerja?: string; // e.g. "7 Jam 15 Menit"
  lokasiMasuk?: {
    lat: number;
    lng: number;
    alamat: string;
    jarakMeter: number;
  };
  lokasiPulang?: {
    lat: number;
    lng: number;
    alamat: string;
    jarakMeter: number;
  };
  fotoSelfieMasuk?: string;
  fotoSelfiePulang?: string;
  aiDetectionResult?: {
    singleFaceDetected: boolean;
    fakeGpsDetected: boolean;
    photoManipulationDetected: boolean;
    confidenceScore: number;
  };
  catatan?: string;
}

export interface IzinRecord {
  id: string;
  guruId: string;
  guruNama: string;
  guruNip: string;
  tipe: 'Izin' | 'Sakit';
  tanggalMulai: string;
  tanggalSelesai: string;
  alasan: string;
  dokumenUrl?: string;
  statusApproval: 'Pending' | 'Disetujui' | 'Ditolak';
  disetujuiOleh?: string;
  tanggalPengajuan: string;
}

export interface SekolahConfig {
  namaSekolah: string;
  npsn: string;
  alamat: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  logoUrl: string;
  koordinat: {
    lat: number;
    lng: number;
  };
  radiusMeter: number; // e.g. 100, 200, 500
  jamMasuk: string; // e.g. "07:00"
  jamToleransi: string; // e.g. "07:15"
  jamPulang: string; // e.g. "14:00"
  spreadsheetId: string;
  driveFolderId: string;
  lastSyncedAt: string;
}

export interface Notifikasi {
  id: string;
  judul: string;
  pesan: string;
  tipe: 'info' | 'warning' | 'success' | 'danger';
  tanggal: string;
  dibaca: boolean;
  waSent?: boolean;
}

export interface RekapBulanan {
  bulan: string; // e.g. "Juli 2026"
  totalHadir: number;
  totalIzin: number;
  totalSakit: number;
  totalAlpa: number;
  totalTerlambatMenit: number;
  persentaseKehadiran: number;
}
