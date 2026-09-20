import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { getDaysUntil } from '../../utils/helpers';
import { staggerContainer, fadeInUp } from '../../utils/animations';
import Badge from '../common/Badge';

const UpcomingDeadlines = () => {
  const { subjects } = useApp();

  // Extract all upcoming items from subjects
  const upcomingItems = subjects.flatMap(subject => 
    (subject.upcomingItems || []).map(item => ({
      ...item,
      subjectName: subject.name,
      subjectColor: subject.color || '#3b82f6'
    }))
  );

  // Sort by date (assuming date is a valid date string)
  upcomingItems.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Take top 4
  const topUpcoming = upcomingItems.slice(0, 4);

  if (topUpcoming.length === 0) return null;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-white">Upcoming</h3>
        <button className="text-ai-blue text-xs font-medium hover:underline">See all</button>
      </div>

      <div className="space-y-2">
        {topUpcoming.map((item, index) => {
          const daysUntil = getDaysUntil(item.date);
          let badgeVariant = 'default';
          if (daysUntil <= 2) badgeVariant = 'danger';
          else if (daysUntil <= 5) badgeVariant = 'warning';

          return (
            <motion.div 
              key={`${item.title}-${index}`} 
              variants={fadeInUp}
              className="glass-card flex items-center p-3"
            >
              <div 
                className="w-2 h-2 rounded-full mr-3 shrink-0" 
                style={{ backgroundColor: item.subjectColor }} 
              />
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-sm font-medium text-white truncate">{item.title}</p>
                <p className="text-white/50 text-xs truncate">{item.subjectName}</p>
              </div>
              <Badge variant={badgeVariant} className="shrink-0 text-[10px]">
                {daysUntil === 0 ? 'Today' : `in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
              </Badge>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default UpcomingDeadlines;
