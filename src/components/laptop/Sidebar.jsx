import React from 'react';
import { Monitor, LayoutDashboard, Library, BrainCircuit, FolderGit2, Smartphone, Settings, User } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'context', label: 'Academic Context', icon: Library },
    { id: 'plan', label: 'AI Study Plan', icon: BrainCircuit },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'devices', label: 'Connected Devices', icon: Smartphone }
  ];

  return (
    <div className="w-64 h-screen border-r border-white/5 bg-dark-900/50 flex flex-col pt-6 pb-6 backdrop-blur-md sticky top-0">
      
      {/* Branding */}
      <div className="px-6 mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ai-cyan to-ai-blue flex items-center justify-center shrink-0">
            <Monitor className="w-4 h-4 text-black" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Nexora</h1>
        </div>
        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Next action + connected academic intelligence</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-bold text-white/30 uppercase tracking-widest px-2 mb-4">Workspace</div>
        
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                isActive 
                  ? 'bg-ai-cyan/10 text-ai-cyan border border-ai-cyan/20' 
                  : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-ai-cyan' : 'text-white/40'}`} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Student Profile / Settings */}
      <div className="px-4 mt-auto">
        <div className="border-t border-white/5 pt-4 pb-2 mb-2">
           <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all">
             <Settings className="w-4 h-4 text-white/40" />
             Settings
           </button>
        </div>
        
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-black/40 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-ai-purple/20 flex items-center justify-center text-ai-purple">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Arjun Mehta</p>
            <p className="text-xs text-white/50 truncate">B.Tech CSE • Sem 5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
