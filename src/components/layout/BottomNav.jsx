import React from 'react';
import { Home, Camera, BookOpen, Brain, User, Folder } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/academics', icon: BookOpen, label: 'Academics' },
    { path: '/capture', icon: Camera, label: 'Capture', special: true },
    { path: '/projects', icon: Folder, label: 'Projects' },
    { path: '/ai-plan', icon: Brain, label: 'AI Plan' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur-2xl border-t border-white/[0.06] pb-safe max-w-[430px] mx-auto border-x sm:border-white/[0.06] border-x-transparent">
      <div className="flex flex-row items-end justify-around h-16 pb-2 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.special) {
            return (
              <motion.div
                key={item.path}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center justify-center -mt-6 cursor-pointer"
                onClick={() => navigate(item.path)}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center mb-1">
                  <Icon size={24} className="text-white" />
                </div>
                <span className="text-[10px] text-white/70">{item.label}</span>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={item.path}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center justify-center gap-1 w-16 cursor-pointer ${
                isActive ? 'text-blue-500' : 'text-white/40'
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={20} />
              <span className="text-[10px]">{item.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
