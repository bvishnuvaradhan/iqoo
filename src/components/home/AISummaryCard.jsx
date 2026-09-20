import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import AIIndicator from '../common/AIIndicator';
import Badge from '../common/Badge';
import { fadeIn } from '../../utils/animations';

const AISummaryCard = () => {
  const { student, subjects, captures } = useApp();
  
  const pendingTasksCount = subjects.reduce((acc, sub) => acc + (sub.pendingTasks || 0), 0);
  const newCapturesCount = captures.filter(c => c.status === 'new' || c.status === 'processing').length;
  
  // Calculate upcoming exams (just mock count based on instruction for summary)
  const upcomingExamsCount = 2;

  return (
    <motion.div variants={fadeIn}>
      <Card variant="ai" className="relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.03] pointer-events-none" />
        
        {/* Top row */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <AIIndicator variant="active" label="ContextAI" />
          <Sparkles size={16} className="text-ai-blue" />
        </div>

        {/* Content */}
        <div className="relative z-10 mb-5">
          <h2 className="text-xl font-bold text-white mb-2">Good evening, {student.firstName || 'Arjun'}</h2>
          <p className="text-sm text-white/80 leading-relaxed">
            You have <strong className="text-white">2 deadlines</strong> this week. Your OS exam is in 8 days. I recommend focusing on <span className="text-gradient font-medium">CPU Scheduling</span> today.
          </p>
        </div>

        {/* Bottom tags */}
        <div className="flex flex-wrap gap-2 relative z-10">
          <Badge variant="warning" className="text-[10px] px-2 py-1">
            {pendingTasksCount} pending tasks
          </Badge>
          <Badge variant="danger" className="text-[10px] px-2 py-1">
            {upcomingExamsCount} upcoming exams
          </Badge>
          <Badge variant="success" className="text-[10px] px-2 py-1">
            {newCapturesCount} new capture{newCapturesCount !== 1 && 's'}
          </Badge>
        </div>
      </Card>
    </motion.div>
  );
};

export default AISummaryCard;
