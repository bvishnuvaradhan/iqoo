import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, FileText, Image, MessageSquare, Type, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fadeIn, staggerContainer, slideUp } from '../../utils/animations';

export default function CaptureHub() {
  const { startCaptureFlow, startTelegramFlow } = useApp();
  const [activeModal, setActiveModal] = useState(null);

  const options = [
    { icon: Camera, label: 'Camera', desc: 'Snap whiteboards', color: 'text-ai-blue', bg: 'bg-ai-blue/10', action: startCaptureFlow },
    { icon: MessageSquare, label: 'Chat Import', desc: 'Parse Telegram JSON', color: 'text-white/80', bg: 'bg-white/10', action: startTelegramFlow },
    { icon: Mic, label: 'Voice', desc: 'Record lectures', color: 'text-ai-purple', bg: 'bg-ai-purple/10', action: () => setActiveModal({ title: 'Voice Capture', icon: Mic, color: 'text-ai-purple', bg: 'bg-ai-purple/20', desc: 'Real-time transcription and contextualization of live lectures.' }) },
    { icon: FileText, label: 'Document', desc: 'Scan syllabi (PDF)', color: 'text-ai-cyan', bg: 'bg-ai-cyan/10', action: () => setActiveModal({ title: 'Document Parse', icon: FileText, color: 'text-ai-cyan', bg: 'bg-ai-cyan/20', desc: 'Extract tasks and deadlines from PDF syllabi and handouts.' }) },
    { icon: Image, label: 'Gallery', desc: 'Import screenshots', color: 'text-accent-success', bg: 'bg-accent-success/10', action: () => setActiveModal({ title: 'Gallery Import', icon: Image, color: 'text-accent-success', bg: 'bg-accent-success/20', desc: 'Process existing screenshots of LMS portals and schedules.' }) },
    { icon: Type, label: 'Text', desc: 'Manual entry', color: 'text-accent-warning', bg: 'bg-accent-warning/10', action: () => setActiveModal({ title: 'Manual Text', icon: Type, color: 'text-accent-warning', bg: 'bg-accent-warning/20', desc: 'Paste raw text to let ContextAI extract the structure.' }) },
  ];

  return (
    <motion.div 
      className="flex flex-col h-full px-6 pt-12 pb-24 max-w-[430px] mx-auto text-center justify-center relative"
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
            className="glass-card flex flex-col items-center justify-center py-5 px-2 gap-2 hover:bg-white/10 transition-colors group"
          >
            <div className={`w-12 h-12 rounded-full ${opt.bg} ${opt.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <opt.icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-bold text-white/90">{opt.label}</span>
              <span className="text-[10px] text-white/40 leading-tight">{opt.desc}</span>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <motion.div variants={fadeIn} className="relative mt-auto">
        {/* Subtle decorative element to anchor the bottom before nav */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-ai-blue/10 blur-[50px] pointer-events-none"></div>
      </motion.div>

      {/* Mock Modal for disabled captures */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-dark-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-ai-blue/10 blur-3xl rounded-full"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl ${activeModal.bg} ${activeModal.color} flex items-center justify-center`}>
                  <activeModal.icon size={24} />
                </div>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="relative z-10 mb-6">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  {activeModal.title}
                  <span className="text-[10px] bg-ai-purple/20 text-ai-purple px-2 py-0.5 rounded-full font-bold">PROTOTYPE</span>
                </h2>
                <p className="text-sm text-white/60 leading-relaxed">
                  {activeModal.desc}
                </p>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-xl p-4 relative z-10">
                <div className="flex items-start gap-3">
                  <Info size={16} className="text-ai-cyan mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-white/50">
                    For this hackathon demo, please use <strong className="text-white/80">Camera</strong> (for whiteboard/handwritten processing) or <strong className="text-white/80">Chat Import</strong> (for Telegram JSON parsing).
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
