import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Mic, FileText, Image, MessageSquare, Type } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fadeIn, staggerContainer, slideUp } from '../../utils/animations';

export default function CaptureHub() {
  const { startCaptureFlow, startTelegramFlow } = useApp();

  const options = [
    { icon: Camera, label: 'Camera', color: 'text-ai-blue', bg: 'bg-ai-blue/10', action: startCaptureFlow },
    { icon: Mic, label: 'Voice', color: 'text-ai-purple', bg: 'bg-ai-purple/10', action: startCaptureFlow },
    { icon: FileText, label: 'Document', color: 'text-ai-cyan', bg: 'bg-ai-cyan/10', action: startCaptureFlow },
    { icon: Image, label: 'Gallery', color: 'text-accent-success', bg: 'bg-accent-success/10', action: startCaptureFlow },
    { icon: Type, label: 'Text', color: 'text-accent-warning', bg: 'bg-accent-warning/10', action: startCaptureFlow },
    { icon: MessageSquare, label: 'Chat Import', color: 'text-white/80', bg: 'bg-white/10', action: startTelegramFlow },
  ];

  return (
    <motion.div 
      className="flex flex-col h-full px-6 pt-12 pb-24 max-w-[430px] mx-auto text-center justify-center"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={slideUp} className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-3">What do you have?</h1>
        <p className="text-sm font-medium text-white/50 tracking-wide">
          Give it anything. <span className="text-transparent bg-clip-text bg-gradient-to-r from-ai-blue via-ai-purple to-ai-cyan font-bold">ContextAI understands it.</span>
        </p>
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-4 mb-16">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            variants={slideUp}
            whileTap={{ scale: 0.95 }}
            onClick={opt.action}
            className="glass-card flex flex-col items-center justify-center py-6 gap-3 hover:bg-white/10 transition-colors group"
          >
            <div className={`w-12 h-12 rounded-full ${opt.bg} ${opt.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <opt.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-white/90">{opt.label}</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.div variants={fadeIn} className="relative mt-auto">
        {/* Subtle decorative element to anchor the bottom before nav */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-ai-blue/10 blur-[50px] pointer-events-none"></div>
      </motion.div>
    </motion.div>
  );
}
