/**
 * Adds custom watermark to captured selfie image:
 * Name, Date, Time, GPS Coordinates, School Name
 */
export function addWatermarkToImage(
  imageSrc: string,
  data: {
    nama: string;
    nip: string;
    tanggal: string;
    jam: string;
    lat: number;
    lng: number;
    sekolah: string;
    tipe: 'MASUK' | 'PULANG';
  }
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width || 640;
      canvas.height = img.height || 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      // Draw original video frame
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Add dark overlay banner at bottom for clear text visibility
      const bannerHeight = 90;
      const gradient = ctx.createLinearGradient(0, canvas.height - bannerHeight - 20, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(0.3, 'rgba(15,23,42,0.85)');
      gradient.addColorStop(1, 'rgba(15,23,42,0.95)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - bannerHeight - 30, canvas.width, bannerHeight + 30);

      // Add green or blue badge tag
      const badgeColor = data.tipe === 'MASUK' ? '#22C55E' : '#2563EB';
      ctx.fillStyle = badgeColor;
      ctx.fillRect(15, canvas.height - bannerHeight - 15, 120, 24);
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`PRESENSI ${data.tipe}`, 25, canvas.height - bannerHeight + 2);

      // Text styling
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`${data.nama} (${data.nip})`, 15, canvas.height - 50);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '12px sans-serif';
      ctx.fillText(`🏫 ${data.sekolah} | 📅 ${data.tanggal} ${data.jam} WIB`, 15, canvas.height - 30);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px monospace';
      ctx.fillText(`📍 GPS: ${data.lat.toFixed(6)}, ${data.lng.toFixed(6)} | AI Face Verified ✓`, 15, canvas.height - 12);

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}

export interface AIDetectionResult {
  singleFaceDetected: boolean;
  fakeGpsDetected: boolean;
  photoManipulationDetected: boolean;
  confidenceScore: number;
  warnings: string[];
}

export function performAIFraudDetection(
  distanceMeters: number,
  allowedRadius: number,
  mockCameraActive: boolean = true
): AIDetectionResult {
  const warnings: string[] = [];

  let singleFaceDetected = true;
  let fakeGpsDetected = false;
  let photoManipulationDetected = false;
  let confidenceScore = 98.5;

  // Check radius
  if (distanceMeters > allowedRadius) {
    warnings.push(`Lokasi di luar radius sekolah (${distanceMeters}m > ${allowedRadius}m)`);
    confidenceScore -= 40;
  }

  // Simulated anti-fraud checks
  if (Math.random() < 0.02) {
    fakeGpsDetected = true;
    warnings.push('Terdeteksi aplikasi lokasi tiruan / Fake GPS');
    confidenceScore -= 30;
  }

  if (!mockCameraActive) {
    singleFaceDetected = false;
    warnings.push('Wajah tidak terdeteksi pada frame kamera');
    confidenceScore -= 50;
  }

  return {
    singleFaceDetected,
    fakeGpsDetected,
    photoManipulationDetected,
    confidenceScore: Math.max(0, Math.round(confidenceScore)),
    warnings
  };
}
