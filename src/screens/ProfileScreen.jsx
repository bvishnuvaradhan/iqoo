import React from 'react';
import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import { staggerContainer } from '../utils/animations';
import StudentCard from '../components/profile/StudentCard';
import DeviceSync from '../components/profile/DeviceSync';
import Settings from '../components/profile/Settings';
import Button from '../components/common/Button';

export default function ProfileScreen() {
  return (
    <div className="min-h-screen bg-dark-950 text-white max-w-[430px] mx-auto px-4 pt-12 pb-24 overflow-y-auto hide-scrollbar">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-white/5">
          <User size={24} className="text-white/80" />
        </div>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-6">
        <StudentCard />
        <DeviceSync />
        <Settings />
        
        <motion.div variants={staggerContainer} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center mt-2 border-white/5">
          <h3 className="font-bold text-lg text-white mb-1">ContextAI</h3>
          <p className="text-xs text-white/40 mb-3">Version 0.1.0-beta</p>
          <p className="text-sm text-white/60">Made with AI ❤️ for students</p>
        </motion.div>
        
        <Button 
          variant="ghost" 
          className="w-full text-accent-danger mt-2 py-4 flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Sign Out
        </Button>
      </motion.div>
    </div>
  );
}
