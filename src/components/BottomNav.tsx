import React from 'react';
import { Home, BarChart3, CalendarDays, User, MapPin } from 'lucide-react';

export type TabType = 'dashboard' | 'rekap' | 'riwayat' | 'guru' | 'sekolah';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  userRole: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Beranda', icon: <Home className="w-5 h-5" /> },
    { id: 'rekap' as TabType, label: 'Rekap', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'riwayat' as TabType, label: 'Riwayat', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'guru' as TabType, label: 'Data Guru', icon: <User className="w-5 h-5" /> },
    { id: 'sekolah' as TabType, label: 'Sekolah', icon: <MapPin className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center shadow-lg sm:hidden">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive
                ? 'text-[#2563EB] font-bold'
                : 'text-gray-400 font-semibold hover:text-[#2563EB]'
            }`}
          >
            <div className={`p-1 rounded-xl ${isActive ? 'bg-blue-50 text-[#2563EB]' : ''}`}>
              {tab.icon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
