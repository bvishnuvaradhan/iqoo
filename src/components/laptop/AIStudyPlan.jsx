import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown, ChevronUp, Clock, Play } from 'lucide-react';
import { slideUp, staggerContainer } from '../../utils/animations';

export default function AIStudyPlan({ recommendations }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!recommendations) return null;

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="p-8 max-w-5xl mx-auto"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <Brain className="w-6 h-6 text-ai-purple" /> Dynamic Study Plan
          </h1>
          <p className="text-white/50 text-sm">Deterministic recommendations based on your active context.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Total Focus Time</p>
          <p className="text-xl font-bold text-ai-purple">
            {recommendations.reduce((acc, r) => acc + (r.durationMinutes || 0), 0)} mins
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, idx) => {
          const isExpanded = expandedId === rec.id;
          return (
            <motion.div 
              key={rec.id}
              variants={slideUp}
              className={`glass-card border bg-dark-800/50 rounded-2xl overflow-hidden transition-colors ${isExpanded ? 'border-ai-purple/50' : 'border-white/5 hover:border-white/10'}`}
            >
              <div 
                className="p-5 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : rec.id)}
              >
                <div className="flex items-center gap-5 flex-1">
                  <div className="w-10 h-10 rounded-full bg-ai-purple/10 flex items-center justify-center text-ai-purple font-bold text-sm border border-ai-purple/20">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{rec.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span className="text-ai-purple font-medium">{rec.subject}</span>
                      <span className="text-white/40 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {rec.durationMinutes}m</span>
                      {rec.deadline && <span className="text-accent-warning flex items-center gap-1 font-medium text-xs bg-accent-warning/10 px-2 py-0.5 rounded-full">Due: {rec.deadline}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                   <button className="bg-ai-purple/20 hover:bg-ai-purple/30 text-ai-purple px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                     <Play className="w-4 h-4" /> {rec.actionLabel}
                   </button>
                   <button className="text-white/30 hover:text-white transition-colors p-2">
                     {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                   </button>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 bg-black/20"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Action Plan</p>
                        <p className="text-sm text-white/80 leading-relaxed mb-4">{rec.description}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Why this task?</p>
                        <ul className="space-y-3">
                          {rec.reasons?.map((reason, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-ai-purple mt-1.5 shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                              <span className="text-sm text-white/70">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        {recommendations.length === 0 && (
          <div className="text-center py-20 text-white/40 border border-white/5 border-dashed rounded-3xl">
             No recommendations available. Update your academic context.
          </div>
        )}
      </div>
    </motion.div>
  );
}
