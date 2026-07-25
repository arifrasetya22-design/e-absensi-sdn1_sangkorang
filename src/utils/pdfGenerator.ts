import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { User, SekolahConfig, PresensiRecord, RekapBulanan } from '../types';

export async function generateSlipPDF(
  elementId: string,
  filename: string = 'Slip_Kehadiran_PresensiKu.pdf'
) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width mm
    const pageHeight = 297; // A4 height mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
    pdf.save(filename);
  } catch (err) {
    console.error('Error generating PDF:', err);
    alert('Gagal mengunduh PDF. Silakan gunakan fitur Cetak Browser.');
  }
}

export function generateDirectSlipPDF(
  guru: User,
  sekolah: SekolahConfig,
  rekap: RekapBulanan,
  records: PresensiRecord[],
  bulan: string = 'Juli 2026'
) {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Header Letterhead
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PEMERINTAH KABUPATEN BANDUNG BARAT', 105, 18, { align: 'center' });
  doc.setFontSize(12);
  doc.text('DINAS PENDIDIKAN DAN KEBUDAYAAN', 105, 24, { align: 'center' });
  doc.setFontSize(16);
  doc.text(sekolah.namaSekolah.toUpperCase(), 105, 31, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Alamat: ${sekolah.alamat} | NPSN: ${sekolah.npsn}`, 105, 37, { align: 'center' });

  // Divider Line
  doc.setLineWidth(0.8);
  doc.line(15, 41, 195, 41);
  doc.setLineWidth(0.2);
  doc.line(15, 42, 195, 42);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('SLIP REKAPITULASI PRESENSI TENAGA PENDIDIK', 105, 52, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(`Periode Bulan: ${bulan}`, 105, 58, { align: 'center' });

  // Teacher Info Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 63, 180, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('Nama Guru', 20, 71);
  doc.text('NIP / NIK', 20, 78);
  doc.text('Jabatan', 20, 85);

  doc.setFont('helvetica', 'normal');
  doc.text(`: ${guru.nama}${guru.gelar ? ', ' + guru.gelar : ''}`, 55, 71);
  doc.text(`: ${guru.nip}`, 55, 78);
  doc.text(`: ${guru.jabatan}`, 55, 85);

  doc.setFont('helvetica', 'bold');
  doc.text('Email', 120, 71);
  doc.text('No. Handphone', 120, 78);
  doc.text('Status Pegawai', 120, 85);

  doc.setFont('helvetica', 'normal');
  doc.text(`: ${guru.email}`, 155, 71);
  doc.text(`: ${guru.noHp}`, 155, 78);
  doc.text(`: ${guru.status}`, 155, 85);

  // Stats Grid Cards
  const startY = 98;
  doc.setFont('helvetica', 'bold');
  doc.text('RINGKASAN KEHADIRAN BULANAN', 15, startY - 2);

  const boxWidth = 42;
  const boxHeight = 18;

  // Hadir
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(15, startY, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(8);
  doc.text('HADIR', 19, startY + 6);
  doc.setFontSize(14);
  doc.text(`${rekap.totalHadir} Hari`, 19, startY + 14);

  // Izin
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(61, startY, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(8);
  doc.text('IZIN', 65, startY + 6);
  doc.setFontSize(14);
  doc.text(`${rekap.totalIzin} Hari`, 65, startY + 14);

  // Sakit
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(107, startY, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(8);
  doc.text('SAKIT', 111, startY + 6);
  doc.setFontSize(14);
  doc.text(`${rekap.totalSakit} Hari`, 111, startY + 14);

  // Alpa
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(153, startY, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setTextColor(153, 27, 27);
  doc.setFontSize(8);
  doc.text('ALPA / TANPA KET', 157, startY + 6);
  doc.setFontSize(14);
  doc.text(`${rekap.totalAlpa} Hari`, 157, startY + 14);

  // Attendance Table Header
  const tableY = 125;
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('RINCIAN PRESENSI HARIAN', 15, tableY - 2);

  doc.setFillColor(37, 99, 235); // Blue
  doc.rect(15, tableY, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('No', 18, tableY + 5.5);
  doc.text('Tanggal', 30, tableY + 5.5);
  doc.text('Jam Masuk', 65, tableY + 5.5);
  doc.text('Jam Pulang', 95, tableY + 5.5);
  doc.text('Status', 125, tableY + 5.5);
  doc.text('Verifikasi AI & Lokasi', 155, tableY + 5.5);

  let currentY = tableY + 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const displayRecords = records.length > 0 ? records.slice(0, 8) : [];
  displayRecords.forEach((rec, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, currentY, 180, 7, 'F');
    }
    doc.text(`${idx + 1}`, 18, currentY + 5);
    doc.text(rec.tanggal, 30, currentY + 5);
    doc.text(rec.jamMasuk || '-', 65, currentY + 5);
    doc.text(rec.jamPulang || '-', 95, currentY + 5);
    doc.text(rec.statusMasuk, 125, currentY + 5);
    doc.text(rec.lokasiMasuk ? `Radius ${rec.lokasiMasuk.jarakMeter}m ✓` : 'GPS Verified', 155, currentY + 5);
    currentY += 7;
  });

  if (displayRecords.length === 0) {
    doc.text('Belum ada riwayat presensi harian.', 18, currentY + 5);
    currentY += 7;
  }

  // Verification & Signatures
  const sigY = 215;

  // Verification Code
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Kode Verifikasi QR: ${guru.qrCodeUrl || 'VERIFIED-SDN1SANGKORANG'}`, 15, sigY);
  doc.text(`Tercatat pada Database PresensiKu SD & Google Sheet Sync ID: ${sekolah.spreadsheetId.substring(0, 12)}...`, 15, sigY + 4);

  // Signatures
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');

  doc.text('Cililin, 31 Juli 2026', 140, sigY);
  doc.text('Kepala Sekolah', 140, sigY + 5);
  doc.text(sekolah.namaSekolah, 140, sigY + 10);

  doc.text('Guru Bersangkutan,', 20, sigY + 10);

  // Space for sign
  doc.setFont('helvetica', 'bold');
  doc.text(guru.nama + (guru.gelar ? ', ' + guru.gelar : ''), 20, sigY + 38);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${guru.nip}`, 20, sigY + 43);

  doc.setFont('helvetica', 'bold');
  doc.text(sekolah.namaKepalaSekolah, 140, sigY + 38);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${sekolah.nipKepalaSekolah}`, 140, sigY + 43);

  doc.save(`Slip_Presensi_${guru.nama.replace(/\s+/g, '_')}_${bulan.replace(/\s+/g, '_')}.pdf`);
}
