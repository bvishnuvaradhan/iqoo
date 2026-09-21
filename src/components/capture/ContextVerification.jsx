import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Check, Shield, Search, RefreshCw, PlusCircle, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { staggerContainer, slideUp } from '../../utils/animations';

export default function ContextVerification() {
  const { captureFlow, confirmVerifiedContext, advanceCaptureStep, resetCaptureFlow } = useApp();
  const data = captureFlow.captureData;
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800), 
      setTimeout(() => setPhase(2), 2000), 
      setTimeout(() => setPhase(3), 3200), 
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!data) return null;

  const handleConfirm = () => {
    confirmVerifiedContext(data);
    advanceCaptureStep('updated');
  };

  const initialConfString = data.initialConfidence 
    ? Math.round(data.initialConfidence * 100) + '%' 
    : '0%';
    
  const finalConfString = data.confidence 
    ? Math.round(data.confidence * 100) + '%' 
    : '0%';

  const renderStateCard = () => {
    const vState = data.verificationState;

    if (vState === 'UPDATE' || vState === 'CONFLICT') {
      const isConflict = vState === 'CONFLICT';
      const color = isConflict ? 'text-accent-danger' : 'text-ai-cyan';
      const bgColor = isConflict ? 'bg-accent-danger/10 border-accent-danger/20' : 'bg-ai-blue/10 border-ai-blue/20';

      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <p className={`text-xs ${color} uppercase tracking-widest font-semibold`}>
              {isConflict ? 'Conflict Detected' : 'Update Detected'}
            </p>
          </div>
          <div className={`glass-card p-5 border ${bgColor}`}>
            <h2 className="text-xl font-bold text-white mb-4">{data.subtopic || 'Unknown Item'}</h2>
            <p className="text-sm text-white/70 mb-4">{data.reason}</p>
            
            {data.changes && data.changes.map((change, idx) => (
              <div key={idx} className="bg-black/30 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-white/40 uppercase font-bold mb-2 tracking-wider">{change.field}</p>
                <div className="flex items-center gap-3">
                  <span className="text-white/60 line-through">{change.old}</span>
                  <ArrowRight className={`w-4 h-4 ${color}`} />
                  <span className={`font-bold ${color}`}>{change.new}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }

    if (vState === 'DUPLICATE') {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <p className="text-xs text-ai-purple uppercase tracking-widest font-semibold">Duplicate Found</p>
          </div>
          <div className="glass-card border border-ai-purple/20 p-5 bg-ai-purple/10">
            <h2 className="text-xl font-bold text-white mb-4">{data.subtopic || 'Unknown Item'}</h2>
            <p className="text-sm text-white/70">{data.reason}</p>
          </div>
        </motion.div>
      );
    }
    
    if (vState === 'NEW') {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <p className="text-xs text-accent-success uppercase tracking-widest font-semibold">New Information</p>
          </div>
          <div className="glass-card border border-accent-success/20 p-5 bg-accent-success/10">
            <h2 className="text-xl font-bold text-white mb-4">New Academic Item</h2>
            <p className="text-sm text-white/70">{data.reason}</p>
          </div>
        </motion.div>
      );
    }

    if (data.isVerified === true) {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <p className="text-xs text-ai-cyan uppercase tracking-widest font-semibold">Verified Match</p>
            <span className="text-xs font-bold text-accent-success bg-accent-success/10 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              {finalConfString} Verified
            </span>
          </div>
          <div className="glass-card ai-border p-5 bg-gradient-to-br from-ai-blue/10 to-transparent">
            <h2 className="text-2xl font-bold text-white mb-4">{data.subtopic || 'Unknown'}</h2>
            <p className="text-sm text-white/70 leading-relaxed border-t border-white/10 pt-4">
              {data.reason || "Nexora matched the incomplete capture with your academic context."}
            </p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="glass-card border-accent-warning/50 p-5 bg-accent-warning/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-accent-warning" />
            <h2 className="text-lg font-bold text-white">Uncertain Match</h2>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            {data.reason || "Nexora could not confidently match this information to your academic context."}
          </p>
        </div>
      </motion.div>
    );
  };

  const renderButtons = () => {
    const vState = data.verificationState;

    if (vState === 'UPDATE' || vState === 'CONFLICT') {
      return (
        <>
          <button onClick={resetCaptureFlow} className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/70 font-semibold hover:bg-white/10 transition-colors flex justify-center items-center gap-2">
            <X className="w-4 h-4" /> Reject
          </button>
          <button onClick={handleConfirm} disabled={phase < 3} className={`flex-[2] py-3.5 rounded-xl font-bold text-white transition-all duration-300 ${phase >= 3 ? (vState === 'UPDATE' ? 'bg-ai-cyan shadow-[0_0_20px_rgba(6,182,212,0.4)] text-black' : 'bg-accent-danger shadow-[0_0_20px_rgba(239,68,68,0.4)]') : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>
            {vState === 'UPDATE' ? 'Accept Update' : 'Force Update'}
          </button>
        </>
      );
    }

    if (vState === 'DUPLICATE') {
      return (
        <button onClick={resetCaptureFlow} disabled={phase < 3} className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 ${phase >= 3 ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}>
          Done
        </button>
      );
    }

    if (data.isVerified === false) {
      return (
        <>
          <button onClick={resetCaptureFlow} className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors flex justify-center items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <button onClick={() => {}} className="flex-[2] py-3.5 rounded-xl font-bold text-white bg-dark-800 border border-white/20 flex justify-center items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Add Manually
          </button>
        </>
      );
    }

    return (
      <>
        <button onClick={resetCaptureFlow} className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/70 font-semibold hover:bg-white/10 transition-colors">
          Correct
        </button>
        <button onClick={handleConfirm} disabled={phase < 3} className={`flex-[2] py-3.5 rounded-xl font-bold text-white transition-all duration-300 ${phase >= 3 ? 'bg-gradient-to-r from-ai-cyan to-ai-blue shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02]' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>
          Accept
        </button>
      </>
    );
  };

  return (
    <motion.div 
      className="flex flex-col h-full px-5 pt-8 pb-24 max-w-[430px] mx-auto overflow-y-auto"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center border border-white/20">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">Verification</h1>
        </div>
        
        {/* Mode Indicator */}
        {data.mode === 'live' ? (
          <div className="flex items-center gap-1.5 bg-ai-blue/10 border border-ai-blue/20 px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-ai-cyan rounded-full animate-pulse"></div>
            <span className="text-[10px] text-ai-cyan font-bold uppercase tracking-widest">Live AI</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-accent-warning/10 border border-accent-warning/20 px-2 py-1 rounded-full">
            <span className="text-[10px] text-accent-warning font-bold uppercase tracking-widest">Demo AI Mode</span>
          </div>
        )}
      </div>

      <motion.div variants={slideUp} className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <p className="text-xs text-white/50 uppercase tracking-widest font-semibold">AI Perception (Raw)</p>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-white/50 uppercase">Confidence</span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${data.initialConfidence > 0.5 ? 'text-accent-warning bg-accent-warning/10' : 'text-accent-danger bg-accent-danger/10'}`}>
              {initialConfString}
            </span>
          </div>
        </div>
        <div className="glass-card p-4 border border-white/5 bg-white/5">
          <p className="text-xl font-mono text-white/80">"{data.rawText || '?'}"</p>
        </div>
      </motion.div>

      {phase >= 1 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            {phase < 3 ? (
              <div className="w-3 h-3 rounded-full border-2 border-ai-blue border-t-transparent animate-spin"></div>
            ) : (
              <div className="w-3 h-3 rounded-full bg-ai-blue shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
            )}
            <p className="text-sm font-semibold text-ai-blue uppercase tracking-wider">Checking context engine</p>
          </div>
          
          <div className="space-y-3 pl-2">
            {data.evidence && data.evidence.length > 0 ? (
              data.evidence.map((ev, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (idx * 0.3) }} className="flex items-center gap-3 text-sm text-white/80">
                  <Check className="w-4 h-4 text-accent-success shrink-0" /> 
                  <span className="leading-snug">{ev}</span>
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 text-sm text-white/50">
                <Search className="w-4 h-4 shrink-0" /> 
                <span>Searching academic history...</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {phase >= 3 && renderStateCard()}

      {/* Buttons */}
      <div className="mt-auto pt-6 flex gap-4">
        {renderButtons()}
      </div>
    </motion.div>
  );
}
