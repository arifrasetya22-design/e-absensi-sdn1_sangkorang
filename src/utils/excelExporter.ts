import { PresensiRecord, User, SekolahConfig } from '../types';

export function exportPresensiToCSV(records: PresensiRecord[], sekolah: SekolahConfig, filename: string = 'rekap_presensi.csv') {
  const headers = [
    'No',
    'Tanggal',
    'NIP',
    'Nama Guru',
    'Jam Masuk',
    'Jam Pulang',
    'Status',
    'Jarak Masuk (m)',
    'Lokasi Masuk',
    'Catatan'
  ];

  const rows = records.map((r, index) => [
    index + 1,
    r.tanggal,
    `"${r.guruNip}"`,
    `"${r.guruNama}"`,
    r.jamMasuk || '-',
    r.jamPulang || '-',
    r.statusMasuk,
    r.lokasiMasuk?.jarakMeter ?? '-',
    `"${r.lokasiMasuk?.alamat || '-'}"`,
    `"${r.catatan || '-'}"`
  ]);

  const csvContent = [
    `"${sekolah.namaSekolah} - Laporan Presensi Digital"`,
    `"NPSN: ${sekolah.npsn}"`,
    `"Diunduh Pada: ${new Date().toLocaleString('id-ID')}"`,
    '',
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportGuruToCSV(gurus: User[], filename: string = 'master_data_guru.csv') {
  const headers = ['No', 'NIP', 'Nama Lengkap', 'Jabatan', 'Email', 'No HP', 'Alamat', 'Status'];

  const rows = gurus.map((g, index) => [
    index + 1,
    `"${g.nip}"`,
    `"${g.nama}${g.gelar ? ', ' + g.gelar : ''}"`,
    `"${g.jabatan}"`,
    `"${g.email}"`,
    `"${g.noHp}"`,
    `"${g.alamat}"`,
    g.status
  ]);

  const csvContent = [
    `"Master Data Guru - SDN 1 Sangkorang"`,
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
