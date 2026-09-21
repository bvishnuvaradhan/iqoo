import React from 'react';
import { Search, Bell, Activity, Loader2 } from 'lucide-react';

export default function TopNav({ syncStatus }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="h-20 w-full border-b border-white/5 bg-dark-900/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      
      {/* Date */}
      <div>
        <p className="text-sm font-medium text-white/50">{today}</p>
        <p className="text-lg font-bold text-white tracking-tight">Desktop Workspace</p>
      </div>

      {/* Center Search (Visual only) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input 
          type="text" 
          placeholder="Search subjects, tasks, or context..." 
          className="w-full bg-black/40 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-ai-cyan/50 transition-colors"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        
        {/* Connection Status */}
        <div className="flex items-center gap-2 bg-black/30 border border-white/5 px-3 py-1.5 rounded-full">
          {syncStatus === 'CONNECTING' ? (
            <Loader2 className="w-3.5 h-3.5 text-accent-warning animate-spin" />
          ) : syncStatus === 'PAIRED' || syncStatus === 'CONNECTED' ? (
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-success"></span>
            </div>
          ) : syncStatus === 'WAITING FOR PHONE' ? (
            <div className="relative flex h-2.5 w-2.5">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-warning"></span>
            </div>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
          )}
          <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">
            {syncStatus}
          </span>
        </div>

        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-full flex items-center justify-center bg-black/40 border border-white/5 hover:bg-white/5 transition-colors">
          <Bell className="w-4 h-4 text-white/70" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-ai-purple border-2 border-[#0a0a0a]"></span>
        </button>
      </div>

    </div>
  );
}
