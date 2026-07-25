// IndexedDB Offline Queue for Presensiku SD
import { PresensiRecord } from '../types';

const DB_NAME = 'PresensiKuDB';
const STORE_NAME = 'offline_presensi_queue';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    try {
      if (typeof indexedDB === 'undefined' || !indexedDB) {
        reject(new Error('IndexedDB is not supported in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        try {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        } catch (err) {
          console.error('Error in onupgradeneeded:', err);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error || new Error('IndexedDB failed to open'));
      };
    } catch (err) {
      reject(err);
    }
  });
}

export async function saveOfflinePresensi(record: PresensiRecord): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(record);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error || new Error('Put failed'));
      } catch (txErr) {
        reject(txErr);
      }
    });
  } catch (err) {
    console.error('Error saving to IndexedDB offline queue:', err);
    try {
      const existing = JSON.parse(localStorage.getItem('presensiku_offline_queue') || '[]');
      existing.push(record);
      localStorage.setItem('presensiku_offline_queue', JSON.stringify(existing));
    } catch (lsErr) {
      console.error('LocalStorage fallback error:', lsErr);
    }
  }
}

export async function getOfflinePresensiQueue(): Promise<PresensiRecord[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error || new Error('GetAll failed'));
      } catch (txErr) {
        reject(txErr);
      }
    });
  } catch (err) {
    console.error('Error reading from IndexedDB offline queue:', err);
    try {
      return JSON.parse(localStorage.getItem('presensiku_offline_queue') || '[]');
    } catch (lsErr) {
      return [];
    }
  }
}

export async function removeOfflinePresensi(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error || new Error('Delete failed'));
      } catch (txErr) {
        reject(txErr);
      }
    });
  } catch (err) {
    console.error('Error removing item from IndexedDB offline queue:', err);
    try {
      const existing: PresensiRecord[] = JSON.parse(localStorage.getItem('presensiku_offline_queue') || '[]');
      const filtered = existing.filter(r => r.id !== id);
      localStorage.setItem('presensiku_offline_queue', JSON.stringify(filtered));
    } catch (lsErr) {
      console.error('LocalStorage fallback error:', lsErr);
    }
  }
}

export async function clearOfflinePresensiQueue(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.clear();

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error || new Error('Clear failed'));
      } catch (txErr) {
        reject(txErr);
      }
    });
  } catch (err) {
    console.error('Error clearing IndexedDB offline queue:', err);
    try {
      localStorage.removeItem('presensiku_offline_queue');
    } catch (lsErr) {
      console.error('LocalStorage fallback error:', lsErr);
    }
  }
}
