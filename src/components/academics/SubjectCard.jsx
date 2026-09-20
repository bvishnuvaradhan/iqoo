import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckSquare, Camera, AlertCircle } from 'lucide-react';
import { fadeInUp } from '../../utils/animations';
import { getRelativeTime } from '../../utils/helpers';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';

export default function SubjectCard({ subject, onClick }) {
  // Check for upcoming exam within 5 days
  const hasUrgentExam = subject.upcomingItems?.some(item => {
    if (item.type !== 'exam' && item.type !== 'quiz') return false;
    const itemDate = new Date(item.date);
    const today = new Date('2026-09-17');
    const diffTime = Math.abs(itemDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5;
  });

  return (
    <motion.div 
      variants={fadeInUp}
      onClick={() => onClick(subject)}
      className="glass-card cursor-pointer p-4 rounded-2xl relative overflow-hidden flex flex-col gap-3"
    >
      {/* Left color border */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1" 
        style={{ backgroundColor: subject.color || '#3b82f6' }}
      />
      
      <div className="flex justify-between items-start ml-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold text-lg">{subject.name}</h3>
            {hasUrgentExam && (
              <Badge variant="danger" size="sm" icon={<AlertCircle size={10} />}>
                Urgent
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="default" size="sm" className="text-[10px]">
              {subject.code}
            </Badge>
            <span className="text-xs text-white/40">{subject.professor}</span>
          </div>
        </div>
      </div>

      <div className="ml-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-white/70">Progress</span>
          <span className="text-xs text-white" style={{ color: subject.color }}>{subject.progress}%</span>
        </div>
        <ProgressBar progress={subject.progress} color={subject.color} />
      </div>

      <div className="flex flex-wrap gap-2 ml-2 mt-2">
        {subject.pendingTasks > 0 && (
          <Badge variant="warning" size="sm" icon={<CheckSquare size={12} />}>
            {subject.pendingTasks} tasks
          </Badge>
        )}
        {subject.recentCaptures > 0 && (
          <Badge variant="default" size="sm" icon={<Camera size={12} />}>
            {subject.recentCaptures} captures
          </Badge>
        )}
        {subject.nextClass && (
          <Badge variant="default" size="sm" icon={<Clock size={12} />}>
            {getRelativeTime(subject.nextClass.time)}
          </Badge>
        )}
      </div>
    </motion.div>
  );
}
