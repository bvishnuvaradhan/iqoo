import React from 'react';
import { Laptop, Smartphone, CheckCircle2, Copy, FileUp, MonitorSmartphone, Gamepad2, ArrowDownUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { slideUp } from '../../utils/animations';

export default function DeviceSync() {
  const { student } = useApp();

  return (
    <motion.div variants={slideUp} className="mb-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          Connected Devices
        </h2>
        <span className="text-xs text-accent-success flex items-center gap-1 bg-accent-success/10 px-2 py-1 rounded-full">
          <CheckCircle2 className="w-3 h-3" /> Seamless Sync On
        </span>
      </div>

      <div className="glass-card p-5 ai-border relative overflow-hidden">
        {/* Connection visualization */}
        <div className="flex flex-col items-center justify-center space-y-4 mb-8 relative z-10">
          
          {/* Phone */}
          <div className="flex items-center justify-center gap-3 w-full p-3 rounded-xl bg-dark-800/80 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-ai-blue/20 flex items-center justify-center text-ai-blue">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">iQOO Phone</p>
              <p className="text-xs text-accent-success">Connected</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-accent-success animate-pulse"></div>
          </div>

          {/* Connection Link */}
          <div className="flex flex-col items-center">
            <div className="h-4 w-px bg-gradient-to-b from-ai-blue to-ai-purple"></div>
            <div className="text-[10px] text-white/50 uppercase tracking-widest bg-dark-900 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1 my-1">
              <ArrowDownUp className="w-3 h-3 text-ai-purple" /> Office Kit
            </div>
            <div className="h-4 w-px bg-gradient-to-t from-ai-purple to-ai-cyan"></div>
          </div>

          {/* Laptop */}
          <div className="flex items-center justify-center gap-3 w-full p-3 rounded-xl bg-dark-800/80 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-ai-cyan/20 flex items-center justify-center text-ai-cyan">
              <Laptop className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Laptop</p>
              <p className="text-xs text-accent-success">Connected</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-accent-success animate-pulse"></div>
          </div>
        </div>

        {/* Capabilities */}
        <div>
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Office Kit Capabilities</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center gap-2">
              <Copy className="w-4 h-4 text-ai-blue" />
              <span className="text-xs text-white/80">Shared Clipboard</span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center gap-2">
              <FileUp className="w-4 h-4 text-ai-purple" />
              <span className="text-xs text-white/80">File Transfer</span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center gap-2">
              <MonitorSmartphone className="w-4 h-4 text-ai-cyan" />
              <span className="text-xs text-white/80">Screen Mirroring</span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-white/60" />
              <span className="text-xs text-white/80">Remote Control</span>
            </div>
          </div>
        </div>
        
        <p className="text-[10px] text-white/30 text-center mt-4 uppercase">Features are simulated in this prototype</p>
      </div>
    </motion.div>
  );
}
