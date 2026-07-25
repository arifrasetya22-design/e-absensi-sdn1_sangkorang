import React from 'react';
import { Home, BarChart3, CalendarDays, User, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export type TabType = 'dashboard' | 'rekap' | 'riwayat' | 'guru' | 'sekolah';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  userRole: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, userRole }) => {
  const allTabs = [
    { id: 'dashboard' as TabType, label: 'Beranda', icon: <Home className="w-5 h-5" />, roles: ['Guru', 'Kepala Sekolah', 'Operator', 'Admin'] },
    { id: 'rekap' as TabType, label: 'Rekap', icon: <BarChart3 className="w-5 h-5" />, roles: ['Guru', 'Kepala Sekolah'] },
    { id: 'riwayat' as TabType, label: 'Riwayat', icon: <CalendarDays className="w-5 h-5" />, roles: ['Guru', 'Kepala Sekolah', 'Operator', 'Admin'] },
    { id: 'guru' as TabType, label: 'Data Guru', icon: <User className="w-5 h-5" />, roles: ['Kepala Sekolah', 'Operator', 'Admin'] },
    { id: 'sekolah' as TabType, label: 'Sekolah', icon: <MapPin className="w-5 h-5" />, roles: ['Guru', 'Kepala Sekolah', 'Operator', 'Admin'] },
  ];

  const tabs = allTabs.filter(t => t.roles.includes(userRole));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 py-2 flex justify-around items-center shadow-lg sm:hidden">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all outline-none"
          >
            {isActive && (
              <motion.div
                layoutId="bottomNavActivePill"
                className="absolute inset-0 bg-blue-50/90 border border-blue-200/60 rounded-2xl -z-10 shadow-xs"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <motion.div
              animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -1 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`p-1 rounded-xl transition-colors ${
                isActive ? 'text-[#2563EB]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.icon}
            </motion.div>
            <span
              className={`text-[10px] font-bold tracking-wider mt-0.5 transition-colors ${
                isActive ? 'text-[#2563EB]' : 'text-slate-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
