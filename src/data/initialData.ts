import { User, SekolahConfig, PresensiRecord, IzinRecord, Notifikasi } from '../types';

export const initialSekolah: SekolahConfig = {
  namaSekolah: 'SDN 1 Sangkorang',
  npsn: '20214829',
  alamat: 'Jl. Raya Sangkorang No. 12, Kec. Cililin, Kab. Bandung Barat, Jawa Barat 40562',
  namaKepalaSekolah: 'H. M. YUSUF, M.Pd.',
  nipKepalaSekolah: '196805101992031004',
  logoUrl: '/logo.svg',
  koordinat: {
    lat: -6.8524,
    lng: 107.6184
  },
  radiusMeter: 100,
  jamMasuk: '07:00',
  jamToleransi: '07:15',
  jamPulang: '14:00',
  spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  driveFolderId: '1z8qX9-K4yEw78Uv_D3P1sTz6V7wL0aBm',
  lastSyncedAt: '2026-07-24 18:00:00'
};

export const initialUsers: User[] = [
  {
    id: 'usr-1',
    email: 'arifrasetya22@gmail.com',
    nip: '198804122015031002',
    nama: 'ARI FRASETYA',
    gelar: 'S.Pd.,Gr.',
    jabatan: 'Guru Kelas III',
    noHp: '081234567890',
    alamat: 'Jl. Melati No. 45, Bandung Barat',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    role: 'Guru',
    status: 'Aktif',
    qrCodeUrl: 'QR-ARI-198804122015031002'
  },
  {
    id: 'usr-2',
    email: 'kepala@sdn1sangkorang.sch.id',
    nip: '196805101992031004',
    nama: 'H. M. YUSUF',
    gelar: 'M.Pd.',
    jabatan: 'Kepala Sekolah',
    noHp: '081398765432',
    alamat: 'Jl. Mawar No. 10, Cililin',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    role: 'Kepala Sekolah',
    status: 'Aktif',
    qrCodeUrl: 'QR-YUSUF-196805101992031004'
  },
  {
    id: 'usr-3',
    email: 'operator@sdn1sangkorang.sch.id',
    nip: '199402182019022001',
    nama: 'RINA WATI',
    gelar: 'S.Kom.',
    jabatan: 'Operator Sekolah',
    noHp: '081567891234',
    alamat: 'Jl. Anggrek No. 8, Batujajar',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    role: 'Operator',
    status: 'Aktif',
    qrCodeUrl: 'QR-RINA-199402182019022001'
  },
  {
    id: 'usr-4',
    email: 'admin@sdn1sangkorang.sch.id',
    nip: '199001012015011001',
    nama: 'ADMIN UTAMA',
    gelar: 'S.T.',
    jabatan: 'Administrator Sistem',
    noHp: '081122334455',
    alamat: 'Gedung SDN 1 Sangkorang',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    role: 'Admin',
    status: 'Aktif',
    qrCodeUrl: 'QR-ADMIN-UTAMA'
  },
  {
    id: 'usr-5',
    email: 'bumantara@sdn1sangkorang.sch.id',
    nip: '199008152018011003',
    nama: 'BUMANTARA',
    gelar: 'S.Pd.',
    jabatan: 'Staf Operator / Guru PJOK',
    noHp: '082198761234',
    alamat: 'Jl. Kenanga No. 12, Cililin',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    role: 'Operator',
    status: 'Aktif',
    qrCodeUrl: 'QR-BUMANTARA-199008152018011003'
  },
  {
    id: 'usr-6',
    email: 'dewi@sdn1sangkorang.sch.id',
    nip: '199205112019032005',
    nama: 'DEWI SARTIKA',
    gelar: 'S.Pd.',
    jabatan: 'Kepala Sekolah Pj / Guru Kelas I',
    noHp: '085712348765',
    alamat: 'Jl. Flamboyan No. 3, Soreang',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    role: 'Kepala Sekolah',
    status: 'Aktif',
    qrCodeUrl: 'QR-DEWI-199205112019032005'
  },
  {
    id: 'usr-7',
    email: 'nuraeni@sdn1sangkorang.sch.id',
    nip: '198503142011012003',
    nama: 'NURAENI',
    gelar: 'S.Pd.SD',
    jabatan: 'Operator Data / Guru Kelas II',
    noHp: '081809871234',
    alamat: 'Jl. Siliwangi No. 99, Cililin',
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    role: 'Operator',
    status: 'Aktif',
    qrCodeUrl: 'QR-NURAENI-198503142011012003'
  }
];

// Sample presence records for July 2026
export const initialPresensi: PresensiRecord[] = [
  {
    id: 'pres-today-ari',
    guruId: 'usr-1',
    guruNama: 'ARI FRASETYA, S.Pd.,Gr.',
    guruNip: '198804122015031002',
    tanggal: '2026-07-24',
    jamMasuk: '07:05:12',
    jamPulang: undefined,
    statusMasuk: 'Hadir',
    lokasiMasuk: {
      lat: -6.85241,
      lng: 107.61842,
      alamat: 'Komplek SDN 1 Sangkorang (Dalam Radius 15m)',
      jarakMeter: 15
    },
    fotoSelfieMasuk: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    aiDetectionResult: {
      singleFaceDetected: true,
      fakeGpsDetected: false,
      photoManipulationDetected: false,
      confidenceScore: 98.6
    }
  },
  {
    id: 'pres-today-yusuf',
    guruId: 'usr-2',
    guruNama: 'H. M. YUSUF, M.Pd.',
    guruNip: '196805101992031004',
    tanggal: '2026-07-24',
    jamMasuk: '06:55:00',
    jamPulang: undefined,
    statusMasuk: 'Hadir',
    lokasiMasuk: {
      lat: -6.85239,
      lng: 107.61839,
      alamat: 'Ruang Kepala Sekolah SDN 1 Sangkorang',
      jarakMeter: 8
    },
    fotoSelfieMasuk: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    aiDetectionResult: {
      singleFaceDetected: true,
      fakeGpsDetected: false,
      photoManipulationDetected: false,
      confidenceScore: 99.1
    }
  },
  {
    id: 'pres-today-bumantara',
    guruId: 'usr-5',
    guruNama: 'BUMANTARA, S.Pd.',
    guruNip: '199008152018011003',
    tanggal: '2026-07-24',
    jamMasuk: '07:22:10',
    jamPulang: undefined,
    statusMasuk: 'Terlambat',
    lokasiMasuk: {
      lat: -6.85245,
      lng: 107.61848,
      alamat: 'Lapangan Olahraga SDN 1 Sangkorang',
      jarakMeter: 28
    },
    fotoSelfieMasuk: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    aiDetectionResult: {
      singleFaceDetected: true,
      fakeGpsDetected: false,
      photoManipulationDetected: false,
      confidenceScore: 97.4
    },
    catatan: 'Macet di perlintasan kereta'
  },
  {
    id: 'pres-yesterday-ari',
    guruId: 'usr-1',
    guruNama: 'ARI FRASETYA, S.Pd.,Gr.',
    guruNip: '198804122015031002',
    tanggal: '2026-07-23',
    jamMasuk: '06:58:14',
    jamPulang: '14:05:22',
    statusMasuk: 'Hadir',
    durasiKerja: '7 Jam 7 Menit',
    lokasiMasuk: {
      lat: -6.85240,
      lng: 107.61840,
      alamat: 'Halaman Depan SDN 1 Sangkorang',
      jarakMeter: 10
    },
    fotoSelfieMasuk: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pres-22-ari',
    guruId: 'usr-1',
    guruNama: 'ARI FRASETYA, S.Pd.,Gr.',
    guruNip: '198804122015031002',
    tanggal: '2026-07-22',
    jamMasuk: '07:02:40',
    jamPulang: '14:10:00',
    statusMasuk: 'Hadir',
    durasiKerja: '7 Jam 7 Menit'
  },
  {
    id: 'pres-21-ari',
    guruId: 'usr-1',
    guruNama: 'ARI FRASETYA, S.Pd.,Gr.',
    guruNip: '198804122015031002',
    tanggal: '2026-07-21',
    jamMasuk: '07:00:15',
    jamPulang: '14:02:10',
    statusMasuk: 'Hadir',
    durasiKerja: '7 Jam 2 Menit'
  }
];

export const initialIzin: IzinRecord[] = [
  {
    id: 'izn-1',
    guruId: 'usr-6',
    guruNama: 'DEWI SARTIKA, S.Pd.',
    guruNip: '199205112019032005',
    tipe: 'Sakit',
    tanggalMulai: '2026-07-24',
    tanggalSelesai: '2026-07-24',
    alasan: 'Demam tinggi dan flu, melampirkan surat dokter dari Puskesmas Cililin.',
    dokumenUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80',
    statusApproval: 'Disetujui',
    disetujuiOleh: 'H. M. YUSUF, M.Pd.',
    tanggalPengajuan: '2026-07-24 06:15:00'
  },
  {
    id: 'izn-2',
    guruId: 'usr-7',
    guruNama: 'NURAENI, S.Pd.SD',
    guruNip: '198503142011012003',
    tipe: 'Izin',
    tanggalMulai: '2026-07-25',
    tanggalSelesai: '2026-07-25',
    alasan: 'Mengikuti Bimbingan Teknis Kurikulum Merdeka Tingkat Kabupaten.',
    dokumenUrl: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&auto=format&fit=crop&q=80',
    statusApproval: 'Pending',
    tanggalPengajuan: '2026-07-24 10:30:00'
  }
];

export const initialNotifikasi: Notifikasi[] = [
  {
    id: 'notif-1',
    judul: 'Presensi Masuk Berhasil',
    pesan: 'ARI FRASETYA, S.Pd.,Gr. berhasil melakukan presensi masuk pada 07.05 WIB dengan AI Face Verified.',
    tipe: 'success',
    tanggal: '2026-07-24 07:05:12',
    dibaca: false,
    waSent: true
  },
  {
    id: 'notif-2',
    judul: 'Notifikasi Terlambat WA',
    pesan: 'Pesan WhatsApp otomatis dikirimkan ke BUMANTARA, S.Pd. karena melakukan presensi lewat dari 07.15 WIB.',
    tipe: 'warning',
    tanggal: '2026-07-24 07:22:10',
    dibaca: false,
    waSent: true
  },
  {
    id: 'notif-3',
    judul: 'Pengajuan Surat Sakit',
    pesan: 'DEWI SARTIKA, S.Pd. mengajukan Surat Sakit untuk hari ini. Kepala Sekolah telah menyetujui.',
    tipe: 'info',
    tanggal: '2026-07-24 06:20:00',
    dibaca: true,
    waSent: true
  }
];
