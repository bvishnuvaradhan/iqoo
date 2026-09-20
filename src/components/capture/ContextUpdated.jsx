import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Brain, ArrowUpRight, CalendarPlus, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fadeIn, slideUp, staggerContainer } from '../../utils/animations';
import { useNavigate } from 'react-router-dom';

export default function ContextUpdated() {
  const { captureFlow, resetCaptureFlow } = useApp();
  const navigate = useNavigate();
  const data = captureFlow.captureData;

  const handleDone = () => {
    resetCaptureFlow();
    navigate('/');
  };

  return (
    <motion.div 
      className="flex flex-col h-full px-4 pt-10 pb-24 max-w-[430px] mx-auto overflow-y-auto"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={slideUp} className="flex flex-col items-center justify-center mb-8 text-center">
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
          className="w-20 h-20 bg-gradient-to-br from-accent-success to-emerald-400 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
        >
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </motion.div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-success to-emerald-200 mb-2">
          Context Updated
        </h1>
        <p className="text-white/70 text-sm">Your {data?.subject || 'Operating Systems'} context has been enriched</p>
      </motion.div>

      <motion.div variants={slideUp} className="glass-card p-5 mb-6">
        <h3 className="text-sm font-semibold text-white/90 mb-4 border-b border-white/10 pb-2">What was updated:</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-sm text-white/80">
            <div className="w-5 h-5 rounded-full bg-ai-purple/20 text-ai-purple flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3" />
            </div>
            <span><strong className="text-white font-medium">{data?.subtopic || 'Round Robin Scheduling'}</strong> linked to CPU Scheduling topic</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-white/80">
            <div className="w-5 h-5 rounded-full bg-accent-success/20 text-accent-success flex items-center justify-center shrink-0 mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
            </div>
            <span>Module completion progress increased by 4%</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-white/80">
            <div className="w-5 h-5 rounded-full bg-ai-cyan/20 text-ai-cyan flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <span>{data?.extractedText?.length || 5} conceptual facts extracted and indexed</span>
          </li>
        </ul>
      </motion.div>

      <motion.div variants={slideUp} className="glass-card ai-border p-5 mb-8 relative overflow-hidden bg-ai-blue/5">
        <div className="absolute top-0 right-0 w-40 h-40 bg-ai-blue/10 blur-3xl rounded-full -mr-10 -mt-10"></div>
        <div className="flex items-center gap-2 mb-3 relative z-10">
          <Brain className="w-5 h-5 text-ai-blue" />
          <h3 className="text-sm font-bold text-white">AI Plan Updated</h3>
        </div>
        <p className="text-sm text-white/80 leading-relaxed mb-4 relative z-10">
          <strong>Revise Round Robin Scheduling</strong><br/>
          Your OS exam is approaching and recent performance indicates this topic needs attention.
        </p>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs text-ai-cyan font-medium">Est. Study Time: 30 min</span>
          <button className="text-xs font-bold text-white bg-ai-blue px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors">
            Start Review
          </button>
        </div>
      </motion.div>

      <motion.div variants={slideUp} className="grid grid-cols-2 gap-3 mb-6">
        <button className="glass-card py-3 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors">
          <ExternalLink className="w-5 h-5 text-white/70" />
          <span className="text-xs font-medium text-white/80">View in Context</span>
        </button>
        <button className="glass-card py-3 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors">
          <CalendarPlus className="w-5 h-5 text-white/70" />
          <span className="text-xs font-medium text-white/80">Set Reminder</span>
        </button>
      </motion.div>

      <div className="mt-auto">
        <motion.button
          variants={slideUp}
          onClick={handleDone}
          className="w-full py-4 rounded-xl bg-white text-dark-950 font-bold text-lg shadow-lg"
        >
          Done
        </motion.button>
      </div>
    </motion.div>
  );
}
