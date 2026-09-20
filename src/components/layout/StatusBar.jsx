import React from 'react';
import { Signal, Wifi, BatteryFull, Laptop } from 'lucide-react';

export default function StatusBar() {
  return (
    <div className="fixed top-0 inset-x-0 h-11 bg-dark-950/80 backdrop-blur-md z-50 flex items-center justify-between px-6 text-white max-w-[430px] mx-auto border-x sm:border-white/[0.06] border-x-transparent">
      <span className="text-xs font-semibold tracking-wider">9:41</span>
      
      {/* Global Connection Indicator */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-lg shadow-lg">
        <div className="w-1.5 h-1.5 bg-accent-success rounded-full animate-pulse"></div>
        <Laptop className="w-3 h-3 text-white/80" />
        <span className="text-[9px] font-semibold text-white/80 tracking-widest uppercase">Laptop Connected</span>
      </div>

      <div className="flex items-center gap-1.5 opacity-80">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <BatteryFull className="w-4 h-4" />
      </div>
    </div>
  );
}
