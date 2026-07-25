import React from 'react';
import { Cloud, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { SekolahConfig } from '../types';

interface SplashScreenProps {
  sekolah?: SekolahConfig;
  onFinished?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ sekolah, onFinished }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white p-6"
    >
      <div className="relative flex items-center justify-center mb-6">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl p-2.5 overflow-hidden"
        >
          {sekolah?.logoUrl ? (
            <img
              src={sekolah.logoUrl}
              alt={sekolah.namaSekolah}
              className="w-full h-full object-contain drop-shadow-md"
            />
          ) : (
            <Cloud className="w-14 h-14 text-white drop-shadow-md" />
          )}
        </motion.div>
        
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-2 -right-2 bg-emerald-400 p-2 rounded-full text-slate-900 shadow-lg"
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h1 className="text-3xl font-extrabold tracking-tight mb-1 text-white">
          PresensiKu <span className="text-emerald-400">SD</span>
        </h1>
        <p className="text-blue-100 text-sm font-medium tracking-wide">
          Sistem Presensi Digital Sekolah Dasar
        </p>
        <p className="text-blue-200/90 text-xs mt-1 font-semibold uppercase tracking-wider">
          {sekolah?.namaSekolah || 'SDN 1 Sangkorang'}
        </p>
      </motion.div>

      <div className="mt-12 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
            className="w-2.5 h-2.5 bg-emerald-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
            className="w-2.5 h-2.5 bg-blue-300 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
            className="w-2.5 h-2.5 bg-white rounded-full"
          />
        </div>
        <span className="text-xs text-blue-200/70 font-sans tracking-wider">
          Memuat data presensi & GPS...
        </span>
      </div>
    </motion.div>
  );
};
