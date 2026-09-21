import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalIcon, Activity, AlertTriangle, BookOpen, Clock } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../utils/animations';

export default function WeeklyOverview() {
  const days = [
    { day: 'Mon', date: '15', intensity: 30 },
    { day: 'Tue', date: '16', intensity: 60 },
    { day: 'Wed', date: '17', intensity: 90, current: true, events: ['DBMS Assign.'] },
    { day: 'Thu', date: '18', intensity: 40 },
    { day: 'Fri', date: '19', intensity: 80, events: ['SA Quiz'] },
    { day: 'Sat', date: '20', intensity: 20 },
    { day: 'Sun', date: '21', intensity: 50 },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-8 pb-20">
      
      <div className="flex items-center gap-3 text-white">
        <div className="p-2 bg-ai-blue/20 rounded-xl">
          <CalIcon size={20} className="text-ai-blue" />
        </div>
        <div>
          <h2 className="text-xl font-bold leading-tight">Week at a Glance</h2>
          <p className="text-xs text-white/50">Your academic intensity for the week.</p>
        </div>
      </div>

      <motion.div variants={fadeInUp} className="glass-card p-5 rounded-3xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-ai-blue/10 blur-3xl rounded-full"></div>

        {/* Bar Chart Area */}
        <div className="flex justify-between items-end h-40 pt-10 mb-4 gap-2 relative z-10 border-b border-white/5 pb-2">
          {days.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end items-center h-full group relative">
              
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(d.intensity, 10)}%` }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                className={`w-full max-w-[20px] rounded-t-lg relative transition-colors ${
                  d.current 
                    ? 'bg-gradient-to-t from-ai-blue/40 to-ai-blue shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                    : 'bg-gradient-to-t from-white/5 to-white/20 group-hover:from-white/10 group-hover:to-white/30'
                }`}
              >
                {/* Tooltip on Hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] font-medium text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg border border-white/10">
                  {d.intensity}% load
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Labels Area */}
        <div className="flex justify-between items-start px-1 relative z-10">
          {days.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${d.current ? 'text-ai-cyan' : 'text-white/40'}`}>
                {d.day}
              </span>
              <span className={`text-sm ${
                d.current 
                  ? 'text-white font-bold bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)] w-7 h-7 flex items-center justify-center rounded-full' 
                  : 'text-white/70'
              }`}>
                {d.date}
              </span>
              {/* Event Dot Indicator */}
              <div className="h-1.5 w-1.5 mt-0.5">
                {d.events && (
                  <div className={`w-1.5 h-1.5 rounded-full ${d.current ? 'bg-ai-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-white/40'}`} />
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Key Events Section */}
      <motion.div variants={fadeInUp} className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
          <Activity size={16} className="text-white/50" /> Key Events
        </h3>
        <div className="flex flex-col gap-3">
          
          <div className="glass-card p-4 rounded-2xl flex items-start gap-4 border-l-4 border-l-accent-danger relative overflow-hidden group hover:bg-white/5 transition-colors">
            <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-accent-danger/10 to-transparent pointer-events-none"></div>
            <div className="p-2 bg-accent-danger/20 rounded-xl text-accent-danger shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">DBMS Assignment Due</h4>
              <div className="flex items-center gap-1.5 text-xs text-white/50 mt-1">
                <Clock size={12} /> Today, 11:59 PM
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-start gap-4 border-l-4 border-l-accent-warning relative overflow-hidden group hover:bg-white/5 transition-colors">
            <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-accent-warning/10 to-transparent pointer-events-none"></div>
            <div className="p-2 bg-accent-warning/20 rounded-xl text-accent-warning shrink-0">
              <BookOpen size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">SA Quiz</h4>
              <div className="flex items-center gap-1.5 text-xs text-white/50 mt-1">
                <CalIcon size={12} /> Friday, Sep 19
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-start gap-4 border-l-4 border-l-ai-blue relative overflow-hidden group hover:bg-white/5 transition-colors">
            <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-ai-blue/10 to-transparent pointer-events-none"></div>
            <div className="p-2 bg-ai-blue/20 rounded-xl text-ai-blue shrink-0">
              <BookOpen size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">OS Midterm Exam</h4>
              <div className="flex items-center gap-1.5 text-xs text-white/50 mt-1">
                <CalIcon size={12} /> Next Wed, Sep 25
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
