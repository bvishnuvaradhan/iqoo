import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Camera, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fadeInUp, staggerContainer } from '../../utils/animations';

export default function PerformanceOverview() {
  const { student, subjects, captures } = useApp();

  const onTrackCount = subjects?.filter(s => s.progress >= 70).length || 0;
  const behindCount = subjects?.filter(s => s.progress < 70).length || 0;
  const totalCaptures = captures?.length || 24;

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 pb-20"
    >
      <motion.div variants={fadeInUp} className="glass-card p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-white/50 mb-1">Cumulative GPA</h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-white">{student?.gpa || '8.72'}</span>
            <div className="flex items-center gap-1 text-accent-success bg-accent-success/10 px-2 py-1 rounded-lg text-sm font-medium mb-1">
              <TrendingUp size={16} />
              <span>+0.15</span>
            </div>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-ai-blue/20 flex items-center justify-center text-ai-blue">
          <Award size={24} />
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-white/70 mb-1">
            <Camera size={16} />
            <span className="text-sm">Knowledge Captures</span>
          </div>
          <span className="text-2xl font-bold text-white">{totalCaptures}</span>
          <span className="text-xs text-white/40">This semester</span>
        </div>
        <div className="glass-card p-4 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-white/70 mb-1">
            <BookOpen size={16} />
            <span className="text-sm">Course Status</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-lg font-bold text-accent-success">{onTrackCount}</span>
            <span className="text-xs text-white/40">on track</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-lg font-bold text-accent-warning">{behindCount}</span>
            <span className="text-xs text-white/40">behind</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="glass-card p-5 rounded-2xl flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-white">Subject Progress</h3>
        <div className="flex flex-col gap-4">
          {subjects?.map((sub, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-white/80">{sub.code}</span>
                <span className="text-white/60">{sub.progress}%</span>
              </div>
              <div className="h-2 w-full bg-dark-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${sub.progress}%`, backgroundColor: sub.color || '#3b82f6' }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
