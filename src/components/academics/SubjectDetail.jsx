import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, FileText, CheckCircle2, Circle, AlertCircle, Network, Brain, ArrowDown } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import { formatDate } from '../../utils/helpers';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';

export default function SubjectDetail({ subject, onBack }) {
  if (!subject) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col gap-4 pb-20 px-2"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors py-2"
      >
        <ArrowLeft size={20} />
        <span className="font-medium text-lg">{subject.name}</span>
      </button>

      <div className="glass-card p-5 rounded-2xl relative overflow-hidden" style={{ borderTop: `4px solid ${subject.color}` }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{subject.name}</h2>
            <div className="flex gap-2 text-sm text-white/70">
              <span>{subject.code}</span>
              <span>•</span>
              <span>{subject.professor}</span>
            </div>
          </div>
        </div>

        {subject.nextClass && (
          <div className="flex flex-col gap-2 bg-white/5 p-3 rounded-xl mt-4 border border-white/5">
            <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Next Class</h4>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-white font-medium">
                <Clock size={16} className="text-ai-blue" />
                <span>{subject.nextClass.time || '10:00 AM'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white font-medium">
                <MapPin size={16} className="text-ai-purple" />
                <span>{subject.room}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Context Intelligence Graph - The Central Idea */}
      {subject.name === 'Operating Systems' && (
        <div className="glass-card p-5 ai-border bg-dark-900/50 mt-2">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
            <Network className="w-5 h-5 text-ai-cyan" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Intelligence Graph</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/5 shadow-md">
              Operating Systems
            </div>
            <ArrowDown className="w-4 h-4 text-white/20 my-1.5" />
            
            <div className="bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/5 shadow-md">
              CPU Scheduling
            </div>
            <ArrowDown className="w-4 h-4 text-white/20 my-1.5" />
            
            <div className="bg-ai-blue/20 text-ai-blue px-4 py-2 rounded-lg text-sm font-bold border border-ai-blue/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              Round Robin Scheduling
            </div>
            <ArrowDown className="w-4 h-4 text-white/20 my-1.5" />
            
            <div className="bg-accent-danger/10 text-accent-danger px-4 py-2 rounded-lg text-sm font-bold border border-accent-danger/20">
              OS Internal Exam
            </div>
            <ArrowDown className="w-4 h-4 text-white/20 my-1.5" />
            
            <div className="bg-accent-warning/10 text-accent-warning px-4 py-2 rounded-lg text-sm font-semibold border border-accent-warning/20">
              Weak quiz performance
            </div>
            <ArrowDown className="w-4 h-4 text-white/20 my-1.5" />
            
            <div className="bg-ai-gradient px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center gap-2">
              <Brain className="w-4 h-4" /> AI Recommendation Active
            </div>
          </div>
        </div>
      )}

      {subject.upcomingItems && subject.upcomingItems.length > 0 && (
        <div className="flex flex-col gap-3 mt-4">
          <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">Upcoming</h3>
          <div className="flex flex-col gap-2">
            {subject.upcomingItems.map((item, i) => (
              <div key={i} className="glass p-4 rounded-xl flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.type === 'exam' ? 'bg-accent-danger/20 text-accent-danger' : 'bg-white/10 text-white/70'}`}>
                  {item.type === 'exam' ? <AlertCircle size={16} /> : <FileText size={16} />}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <span className="text-xs text-white/50">{formatDate(item.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </motion.div>
  );
}
