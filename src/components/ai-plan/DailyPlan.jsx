import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { slideUp, staggerContainer } from '../../utils/animations';
import { useApp } from '../../context/AppContext';

export default function DailyPlan() {
  const { recommendations } = useApp();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'text-ai-purple bg-ai-purple/20 border-l-ai-purple bg-ai-purple/5';
    if (priority === 'medium') return 'text-ai-blue bg-ai-blue/20 border-l-ai-blue bg-ai-blue/5';
    return 'text-white/70 bg-white/10 border-l-white/20 bg-dark-900/50';
  };

  const getPriorityText = (priority) => {
    if (priority === 'high') return 'text-ai-purple';
    if (priority === 'medium') return 'text-ai-blue';
    return 'text-white/70';
  };

  return (
    <motion.div 
      className="px-4 pb-24"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={slideUp} className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
          <Brain className="w-6 h-6 text-ai-purple" />
          Today's AI Plan
        </h1>
        <p className="text-sm text-white/60">Deterministically optimized based on your verified academic context.</p>
      </motion.div>

      {/* Plan List */}
      <motion.div variants={slideUp} className="space-y-4 mb-8">
        {recommendations.length > 0 ? (
          recommendations.map((rec) => {
            const styles = getPriorityColor(rec.priority);
            const isExpanded = expandedId === rec.id;
            const priorityLabelParts = styles.split(' ');
            const cardBg = priorityLabelParts.pop();
            const borderCol = priorityLabelParts.pop();
            const bgCol = priorityLabelParts.pop();
            const textCol = priorityLabelParts.pop();

            return (
              <div key={rec.id} className="glass-card overflow-hidden">
                <div 
                  className={`p-4 border-l-4 ${borderCol} ${cardBg} flex justify-between items-center cursor-pointer`}
                  onClick={() => toggleExpand(rec.id)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{rec.title}</h3>
                      {rec.priority === 'high' && <div className="w-2 h-2 rounded-full bg-ai-purple animate-pulse"></div>}
                    </div>
                    <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">{rec.subject}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`${bgCol} ${textCol} px-3 py-1.5 rounded-lg text-sm font-bold`}>
                      {rec.estimatedTime}
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-white/40" /> : <ChevronDown className="w-5 h-5 text-white/40" />}
                  </div>
                </div>

                {/* Explainability Section - "Why?" */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-dark-900 border-t border-white/5"
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Brain className={`w-4 h-4 ${getPriorityText(rec.priority)}`} />
                          <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest">Why recommended?</h4>
                        </div>
                        <ul className="space-y-2">
                          {rec.reasons?.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <CheckCircle className={`w-3.5 h-3.5 mt-0.5 ${getPriorityText(rec.priority)} shrink-0`} />
                              <span className="text-sm font-medium text-white/80">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="text-center p-8 text-white/50 border border-dashed border-white/20 rounded-2xl">
            No active recommendations. You're all caught up!
          </div>
        )}
      </motion.div>

    </motion.div>
  );
}
