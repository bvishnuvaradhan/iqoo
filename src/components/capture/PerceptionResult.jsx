import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText, Tag, RefreshCw, ChevronRight, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fadeIn, staggerContainer, slideUp } from '../../utils/animations';

export default function PerceptionResult() {
  const { captureFlow, advanceCaptureStep, resetCaptureFlow } = useApp();
  const data = captureFlow.captureData;

  if (!data) return null;

  return (
    <motion.div 
      className="flex flex-col h-full px-4 pt-6 pb-8 max-w-[430px] mx-auto overflow-y-auto"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={slideUp} className="flex flex-col items-center justify-center mb-6 text-center">
        <div className="w-12 h-12 bg-accent-success/20 text-accent-success rounded-full flex items-center justify-center mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white mb-1">AI Perception Complete</h1>
        <p className="text-sm text-accent-success font-medium">{Math.round(data.confidence * 100)}% Confidence Match</p>
      </motion.div>

      <motion.div variants={slideUp} className="glass-card p-5 mb-6 ai-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-ai-blue"></div>
          <span className="text-sm font-medium text-white/70 uppercase tracking-wide">Identified Context</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-white/60 text-xs mb-1">Subject</h3>
            <p className="text-white font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-ai-blue" />
              {data.subject}
            </p>
          </div>
          <div>
            <h3 className="text-white/60 text-xs mb-1">Topic Path</h3>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-white/80">{data.topic}</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
              <span className="text-white font-medium text-ai-purple">{data.subtopic}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div>
              <h3 className="text-white/60 text-xs mb-1">Content Type</h3>
              <span className="inline-flex px-2 py-1 bg-dark-700 rounded-md text-xs font-medium text-white/90">
                {data.type_detected}
              </span>
            </div>
            <div className="text-right">
              <h3 className="text-white/60 text-xs mb-1">Match Quality</h3>
              <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full bg-accent-success rounded-full" style={{ width: `${data.confidence * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={slideUp} className="mb-6">
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3 px-1">Extracted Content</h2>
        <div className="space-y-2">
          {data.extractedText.map((text, i) => (
            <div key={i} className="glass-card p-3 flex items-start gap-3">
              <FileText className="w-4 h-4 text-ai-cyan mt-0.5 shrink-0" />
              <p className="text-sm text-white/90">{text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={slideUp} className="mb-8">
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3 px-1">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {data.tags.map(tag => (
            <div key={tag} className="flex items-center gap-1 px-3 py-1.5 glass bg-white/5 rounded-full">
              <Tag className="w-3 h-3 text-white/50" />
              <span className="text-xs text-white/80">{tag}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mt-auto space-y-3">
        <motion.button
          variants={slideUp}
          onClick={() => advanceCaptureStep('verification')}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-ai-blue to-ai-purple text-white font-semibold shadow-lg shadow-ai-blue/20"
        >
          Verify & Save Context
        </motion.button>
        <motion.button
          variants={slideUp}
          onClick={() => advanceCaptureStep('camera')}
          className="w-full py-3 rounded-xl bg-dark-800 text-white/70 font-medium flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Re-capture
        </motion.button>
      </div>
    </motion.div>
  );
}
