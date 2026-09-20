import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Mic, Upload, ScanLine } from 'lucide-react';
import { staggerContainer, fadeInUp } from '../../utils/animations';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'camera',
      label: 'Camera Capture',
      icon: <Camera size={20} className="text-ai-blue" />,
      bg: 'bg-ai-blue/10',
      border: 'border-ai-blue/20',
      onClick: () => navigate('/capture')
    },
    {
      id: 'voice',
      label: 'Voice Note',
      icon: <Mic size={20} className="text-ai-purple" />,
      bg: 'bg-ai-purple/10',
      border: 'border-ai-purple/20',
      onClick: () => alert('Voice note feature coming soon')
    },
    {
      id: 'upload',
      label: 'Upload',
      icon: <Upload size={20} className="text-ai-cyan" />,
      bg: 'bg-ai-cyan/10',
      border: 'border-ai-cyan/20',
      onClick: () => alert('Upload feature coming soon')
    },
    {
      id: 'scan',
      label: 'Scan Document',
      icon: <ScanLine size={20} className="text-accent-warning" />,
      bg: 'bg-accent-warning/10',
      border: 'border-accent-warning/20',
      onClick: () => alert('Document scanning feature coming soon')
    }
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="w-full">
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            variants={fadeInUp}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center p-2 glass-card hover:bg-white/[0.08] transition-colors"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${action.bg} border ${action.border}`}>
              {action.icon}
            </div>
            <span className="text-[10px] font-medium text-white/80 text-center leading-tight">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;
