import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, ShieldAlert, CheckCircle } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function FocusRecommendation() {
  const [addedItems, setAddedItems] = useState(new Set());

  const toggleAdd = (index) => {
    setAddedItems(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const recommendations = [
    { title: 'CPU Scheduling', subject: 'OS', color: '#3b82f6', desc: 'Complete remaining algorithms before Sep 25 exam.', priority: 'high' },
    { title: 'ER Diagrams', subject: 'DBMS', color: '#8b5cf6', desc: 'Assignment due Sep 20, complete tonight to stay on track.', priority: 'high' },
    { title: 'Design Patterns', subject: 'SA', color: '#06b6d4', desc: 'Quiz on Sep 19, review Strategy & Observer patterns.', priority: 'medium' }
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-5 pb-20">
      <motion.div variants={fadeInUp} className="flex items-center gap-2 text-white mb-2">
        <Target size={24} className="text-ai-purple" />
        <h2 className="text-xl font-bold">Focus Areas This Week</h2>
      </motion.div>

      {recommendations.map((rec, i) => {
        const isAdded = addedItems.has(i);
        
        return (
          <motion.div key={i} variants={fadeInUp} className="glass-card p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: rec.color }} />
            <div className="ml-2 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                    {rec.priority === 'high' && <Zap size={14} className="text-accent-warning fill-accent-warning" />}
                  </div>
                  <Badge variant="default" size="sm" style={{ backgroundColor: `${rec.color}20`, color: rec.color }}>
                    {rec.subject}
                  </Badge>
                </div>
                <Badge variant={rec.priority === 'high' ? 'danger' : 'warning'} size="sm">
                  {rec.priority}
                </Badge>
              </div>
              
              <p className="text-sm text-white/70 leading-relaxed">{rec.desc}</p>
              
              <div className="mt-1 flex justify-end">
                <Button 
                  variant={isAdded ? "primary" : "secondary"} 
                  size="sm" 
                  className={`text-xs py-1.5 px-3 transition-colors ${isAdded ? '!bg-emerald-500/20 !text-emerald-400 !border-emerald-500/50 !shadow-none' : ''}`}
                  onClick={() => toggleAdd(i)}
                  icon={isAdded ? CheckCircle : undefined}
                >
                  {isAdded ? "Added to Plan" : "Add to Plan"}
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}

      <motion.div variants={fadeInUp} className="glass p-4 rounded-xl flex items-center gap-3 ai-border mt-2">
        <ShieldAlert size={18} className="text-ai-cyan shrink-0" />
        <p className="text-xs text-white/60">
          <span className="text-white font-medium text-gradient">AI Confidence: High</span> — based on 12 data points from your recent captures and syllabus progress.
        </p>
      </motion.div>
    </motion.div>
  );
}
