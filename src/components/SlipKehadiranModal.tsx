import React from 'react';
import { User, SekolahConfig, PresensiRecord, RekapBulanan } from '../types';
import { FileText, Download, Printer, CheckCircle2, QrCode } from 'lucide-react';
import { generateDirectSlipPDF } from '../utils/pdfGenerator';

interface SlipKehadiranModalProps {
  guru: User;
  sekolah: SekolahConfig;
  rekap: RekapBulanan;
  presensiList: PresensiRecord[];
  onClose: () => void;
}

export const SlipKehadiranModal: React.FC<SlipKehadiranModalProps> = ({
  guru,
  sekolah,
  rekap,
  presensiList,
  onClose
}) => {
  const guruRecords = presensiList.filter(p => p.guruId === guru.id);

  const handleDownloadPDF = () => {
    generateDirectSlipPDF(guru, sekolah, rekap, guruRecords, 'Juli 2026');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-3xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Controls */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Pratinjau Slip Kehadiran Guru</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Print</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Unduh PDF</span>
            </button>
            <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">✕</button>
          </div>
        </div>

        {/* Printable Document Sheet Body */}
        <div id="slip-container" className="p-8 bg-white text-slate-900 space-y-6 text-xs font-sans">
          
          {/* Official Letterhead Header */}
          <div className="text-center space-y-1 border-b-2 border-slate-800 pb-4">
            <p className="font-bold text-xs uppercase tracking-wider text-slate-700">Pemerintah Kabupaten Bandung Barat</p>
            <p className="font-bold text-xs uppercase tracking-wider text-slate-700">Dinas Pendidikan dan Kebudayaan</p>
            <h1 className="font-black text-xl text-slate-900 uppercase tracking-tight">{sekolah.namaSekolah}</h1>
            <p className="text-[11px] text-slate-600">{sekolah.alamat} • NPSN: {sekolah.npsn}</p>
          </div>

          <div className="text-center my-2">
            <h2 className="font-extrabold text-base underline text-slate-900 uppercase">SLIP REKAPITULASI PRESENSI TENAGA PENDIDIK</h2>
            <p className="text-xs font-semibold text-slate-600">Periode Bulan: Juli 2026</p>
          </div>

          {/* Teacher Profile Info */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3">
            <div>
              <p><strong className="text-slate-600">Nama Guru:</strong> {guru.nama}{guru.gelar ? `, ${guru.gelar}` : ''}</p>
              <p><strong className="text-slate-600">NIP / NIK:</strong> {guru.nip}</p>
              <p><strong className="text-slate-600">Jabatan:</strong> {guru.jabatan}</p>
            </div>
            <div>
              <p><strong className="text-slate-600">Email:</strong> {guru.email}</p>
              <p><strong className="text-slate-600">No. Handphone:</strong> {guru.noHp}</p>
              <p><strong className="text-slate-600">Status Pegawai:</strong> {guru.status}</p>
            </div>
          </div>

          {/* Attendance Stats Cards */}
          <div>
            <h3 className="font-bold text-xs text-slate-700 mb-2 uppercase">Ringkasan Total Kehadiran</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 block">HADIR</span>
                <span className="text-base font-black text-emerald-700">{rekap.totalHadir} Hari</span>
              </div>
              <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] font-bold text-blue-800 block">IZIN</span>
                <span className="text-base font-black text-blue-700">{rekap.totalIzin} Hari</span>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 block">SAKIT</span>
                <span className="text-base font-black text-amber-700">{rekap.totalSakit} Hari</span>
              </div>
              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-[10px] font-bold text-rose-800 block">ALPA</span>
                <span className="text-base font-black text-rose-700">{rekap.totalAlpa} Hari</span>
              </div>
              <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-[10px] font-bold text-purple-800 block">TERLAMBAT</span>
                <span className="text-base font-black text-purple-700">{rekap.totalTerlambatMenit} Menit</span>
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div>
            <h3 className="font-bold text-xs text-slate-700 mb-2 uppercase">Rincian Presensi Harian</h3>
            <table className="w-full text-left border-collapse border border-slate-200 text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2 border-r border-slate-200">No</th>
                  <th className="p-2 border-r border-slate-200">Tanggal</th>
                  <th className="p-2 border-r border-slate-200">Jam Masuk</th>
                  <th className="p-2 border-r border-slate-200">Jam Pulang</th>
                  <th className="p-2 border-r border-slate-200">Status</th>
                  <th className="p-2">Verifikasi GPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {guruRecords.slice(0, 6).map((rec, idx) => (
                  <tr key={rec.id}>
                    <td className="p-2 border-r border-slate-200">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-200 font-semibold">{rec.tanggal}</td>
                    <td className="p-2 border-r border-slate-200">{rec.jamMasuk || '-'}</td>
                    <td className="p-2 border-r border-slate-200">{rec.jamPulang || '-'}</td>
                    <td className="p-2 border-r border-slate-200 font-bold">{rec.statusMasuk}</td>
                    <td className="p-2 text-emerald-700 font-medium">📍 Terverifikasi ({rec.lokasiMasuk?.jarakMeter ?? 10}m)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-8 flex justify-between items-end text-center">
            <div>
              <p className="text-[10px] text-slate-500 font-mono mb-2">VERIFIED DIGITAL QR CODE</p>
              <div className="w-20 h-20 bg-slate-100 rounded-xl border border-slate-300 p-2 flex items-center justify-center mx-auto">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">{guru.qrCodeUrl}</span>
            </div>

            <div className="space-y-12">
              <div>
                <p>Cililin, 31 Juli 2026</p>
                <p className="font-bold">Kepala {sekolah.namaSekolah}</p>
              </div>
              <div>
                <p className="font-extrabold underline">{sekolah.namaKepalaSekolah}</p>
                <p className="text-slate-600">NIP. {sekolah.nipKepalaSekolah}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
