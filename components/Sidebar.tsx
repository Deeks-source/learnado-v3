
import React from 'react';
import { BookOpen, GraduationCap, BarChart3, SunMoon, HelpCircle } from 'lucide-react';
import { SidebarTab } from '../types';

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const NavItem = ({ icon: Icon, tab, label }: { icon: any, tab: SidebarTab, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`group relative flex flex-col items-center gap-2 p-4 transition-all duration-500 rounded-2xl ${
        activeTab === tab 
          ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.4)]' 
          : 'text-zinc-500 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={22} strokeWidth={activeTab === tab ? 2.5 : 2} />
      <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${activeTab === tab ? 'opacity-100' : 'opacity-60'}`}>
        {label}
      </span>
    </button>
  );

  return (
    <aside className="h-full w-[100px] flex flex-col items-center py-10 bg-zinc-950 border-r border-white/5 shadow-2xl">
      <div className="mb-14 text-green-500 p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <nav className="flex flex-col gap-8 w-full px-3">
        <NavItem icon={BookOpen} tab="library" label="Library" />
        <NavItem icon={GraduationCap} tab="exams" label="Exams" />
        <NavItem icon={BarChart3} tab="grades" label="Grades" />
        <NavItem icon={SunMoon} tab="settings" label="Theme" />
      </nav>

      <div className="mt-auto flex flex-col gap-8 px-3">
        <button className="p-4 text-zinc-500 hover:text-white transition-colors rounded-2xl hover:bg-white/5">
          <HelpCircle size={22} />
        </button>
        <button className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/5 hover:border-green-500/50 transition-all p-0.5">
          <img src="https://picsum.photos/seed/user/64/64" alt="Profile" className="w-full h-full object-cover rounded-xl" />
        </button>
      </div>
    </aside>
  );
};
