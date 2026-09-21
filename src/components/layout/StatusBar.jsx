import React from 'react';
import { Signal, Wifi, BatteryFull, Laptop } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function StatusBar() {
  const { laptopConnected } = useApp();
  return (
    <div className="fixed top-0 inset-x-0 h-11 bg-dark-950/80 backdrop-blur-md z-50 flex items-center justify-between px-6 text-white max-w-[430px] mx-auto border-x sm:border-white/[0.06] border-x-transparent">
      <span className="text-xs font-semibold tracking-wider">9:41</span>
      
      {/* Global Connection Indicator */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-lg shadow-lg">
        <div className={`w-1.5 h-1.5 rounded-full ${laptopConnected ? 'bg-accent-success animate-pulse' : 'bg-white/20'}`}></div>
        <Laptop className={`w-3 h-3 ${laptopConnected ? 'text-white/80' : 'text-white/40'}`} />
        <span className={`text-[9px] font-semibold tracking-widest uppercase ${laptopConnected ? 'text-white/80' : 'text-white/40'}`}>
          {laptopConnected ? 'Laptop Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 opacity-80">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <BatteryFull className="w-4 h-4" />
      </div>
    </div>
  );
}
