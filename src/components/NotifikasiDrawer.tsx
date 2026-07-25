import React from 'react';
import { Notifikasi } from '../types';
import { Bell, Check, MessageCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

interface NotifikasiDrawerProps {
  notifikasiList: Notifikasi[];
  onClose: () => void;
  onMarkAllRead: () => void;
}

export const NotifikasiDrawer: React.FC<NotifikasiDrawerProps> = ({
  notifikasiList,
  onClose,
  onMarkAllRead
}) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Notifikasi & WA Alerts</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Aktivitas Realtime</span>
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Tandai Semua Dibaca
            </button>
          </div>

          {notifikasiList.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">Belum ada notifikasi baru.</p>
          ) : (
            notifikasiList.map(n => (
              <div
                key={n.id}
                className={`p-3 rounded-2xl border text-xs space-y-1 transition-all ${
                  !n.dibaca ? 'bg-blue-50/70 border-blue-200' : 'bg-slate-50 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    {n.tipe === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {n.tipe === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                    {n.tipe === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0" />}
                    <span>{n.judul}</span>
                  </span>
                  {n.waSent && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>WA Dispatch</span>
                    </span>
                  )}
                </div>
                <p className="text-slate-600 leading-relaxed">{n.pesan}</p>
                <span className="text-[10px] text-slate-400 block pt-1">{n.tanggal}</span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <p className="text-[11px] text-slate-500 font-medium">Terhubung dengan WhatsApp Gateway API</p>
        </div>

      </div>
    </div>
  );
};
