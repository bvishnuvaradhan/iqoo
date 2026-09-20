import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalIcon, Activity } from 'lucide-react';
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
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-6 pb-20">
      <div className="flex items-center gap-2 mb-2 text-white">
        <CalIcon size={24} className="text-ai-blue" />
        <h2 className="text-xl font-bold">Week at a Glance</h2>
      </div>

      <motion.div variants={fadeInUp} className="glass-card p-5 rounded-2xl">
        <div className="flex justify-between items-end h-32 mb-6 gap-2">
          {days.map((d, i) => (
            <div key={i} className="flex flex-col items-center flex-1 gap-2">
              <div 
                className={`w-full rounded-md transition-all ${d.current ? 'bg-ai-blue' : 'bg-white/20'}`}
                style={{ height: `${Math.max(d.intensity, 15)}%` }}
              />
              <span className={`text-xs font-medium ${d.current ? 'text-white' : 'text-white/50'}`}>
                {d.day}
              </span>
              <span className={`text-sm ${d.current ? 'text-ai-blue font-bold' : 'text-white/70'}`}>
                {d.date}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity size={18} className="text-white/50" /> Key Events
        </h3>
        <div className="flex flex-col gap-3">
          <div className="glass-card p-4 rounded-xl flex justify-between items-center border-l-4 border-l-accent-danger">
            <div>
              <h4 className="font-medium text-white text-sm">DBMS Assignment Due</h4>
              <p className="text-xs text-white/50 mt-1">Today, 11:59 PM</p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl flex justify-between items-center border-l-4 border-l-accent-warning">
            <div>
              <h4 className="font-medium text-white text-sm">SA Quiz</h4>
              <p className="text-xs text-white/50 mt-1">Friday, Sep 19</p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl flex justify-between items-center border-l-4 border-l-ai-blue">
            <div>
              <h4 className="font-medium text-white text-sm">OS Midterm Exam</h4>
              <p className="text-xs text-white/50 mt-1">Next Wed, Sep 25</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
