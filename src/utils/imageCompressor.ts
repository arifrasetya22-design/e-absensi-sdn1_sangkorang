/**
 * Helper to compress image files (photos, logos) using HTML5 Canvas.
 * Prevents LocalStorage Quota Exceeded errors by keeping image base64 strings small (~10KB-30KB).
 */
export const compressImageFile = (
  file: File,
  maxWidth = 300,
  maxHeight = 300,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File yang diunggah harus berupa gambar (JPG, PNG, WEBP).'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          // Draw white background in case image has transparency and converting to JPEG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.warn('Canvas compression failed, falling back to original data url:', err);
          resolve(event.target?.result as string);
        }
      };

      img.onerror = (err) => {
        reject(new Error('Gagal memproses file gambar. Format file mungkin tidak valid.'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = (err) => {
      reject(new Error('Gagal membaca file dari perangkat.'));
    };

    reader.readAsDataURL(file);
  });
};
