import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import Badge from '../common/Badge';

export default function ScheduleView() {
  const { schedule } = useApp();
  const todaySchedule = schedule?.today || [];
  
  // Hardcoded for demo purposes
  const currentTime = "09:41";
  const currentDate = "Wed, Sep 17";

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 pb-20"
    >
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center gap-2 text-white">
          <Calendar size={24} className="text-ai-blue" />
          <h2 className="text-xl font-bold">Today's Schedule</h2>
        </div>
        <span className="text-sm text-white/50">{currentDate}</span>
      </div>

      <div className="relative pl-4 mt-2">
        {/* Timeline line */}
        <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-white/10" />

        <div className="flex flex-col gap-6">
          {todaySchedule.map((item, index) => {
            const isCurrent = item.startTime <= currentTime && item.endTime >= currentTime;
            const isUpcoming = item.startTime > currentTime;
            
            return (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="relative flex items-start gap-4"
              >
                {/* Timeline dot */}
                <div 
                  className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center mt-1
                    ${isCurrent ? 'bg-ai-blue shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-dark-900 border-2 border-white/20'}`}
                >
                  {isCurrent && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                {/* Class Card */}
                <div 
                  className={`flex-1 glass-card p-4 rounded-xl border ${isCurrent ? 'border-ai-blue/30 shadow-[0_4px_20px_rgba(59,130,246,0.1)]' : 'border-white/5'} ${isUpcoming ? 'opacity-90' : 'opacity-60'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white" style={{ color: item.color || '#fff' }}>
                      {item.subject}
                    </h3>
                    <Badge variant="default" size="sm" className="bg-white/5 text-white/70">
                      {item.type}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 mt-3 text-sm text-white/70">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-white/40" />
                      <span>{item.startTime} - {item.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-white/40" />
                      <span>{item.room}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
