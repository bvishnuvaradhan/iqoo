import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';
import AIIndicator from '../components/common/AIIndicator';
import DailyPlan from '../components/ai-plan/DailyPlan';
import TaskList from '../components/ai-plan/TaskList';
import FocusRecommendation from '../components/ai-plan/FocusRecommendation';
import WeeklyOverview from '../components/ai-plan/WeeklyOverview';

export default function AIPlanScreen() {
  const [activeView, setActiveView] = useState('daily');
  
  const tabs = [
    { id: 'daily', label: 'Daily' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'focus', label: 'Focus' },
    { id: 'weekly', label: 'Weekly' }
  ];

  const renderContent = () => {
    switch(activeView) {
      case 'tasks': return <TaskList />;
      case 'focus': return <FocusRecommendation />;
      case 'weekly': return <WeeklyOverview />;
      case 'daily':
      default: return <DailyPlan />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white max-w-[430px] mx-auto px-4 pt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-ai-blue/10 relative">
          <Brain size={24} className="text-ai-blue relative z-10" />
          <div className="absolute inset-0 bg-ai-blue/20 blur-md rounded-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gradient">AI Study Plan</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <AIIndicator size="sm" variant="active" />
            <p className="text-xs text-white/50">Updated just now</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto hide-scrollbar mb-6 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                activeView === tab.id 
                  ? 'bg-ai-blue/20 text-ai-blue border border-ai-blue/30' 
                  : 'bg-dark-900 text-white/60 border border-white/5 hover:text-white/90'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
