import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { staggerContainer } from '../utils/animations';
import SubjectCard from '../components/academics/SubjectCard';
import SubjectDetail from '../components/academics/SubjectDetail';
import ScheduleView from '../components/academics/ScheduleView';
import PerformanceOverview from '../components/academics/PerformanceOverview';

export default function AcademicsScreen() {
  const { student, subjects } = useApp();
  const [activeView, setActiveView] = useState('subjects');
  const [selectedSubject, setSelectedSubject] = useState(null);

  const renderContent = () => {
    if (selectedSubject) {
      return <SubjectDetail subject={selectedSubject} onBack={() => setSelectedSubject(null)} />;
    }

    switch (activeView) {
      case 'schedule':
        return <ScheduleView />;
      case 'performance':
        return <PerformanceOverview />;
      case 'subjects':
      default:
        return (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4 pb-20"
          >
            {subjects?.map((subject, index) => (
              <SubjectCard 
                key={index} 
                subject={subject} 
                onClick={(sub) => setSelectedSubject(sub)} 
              />
            ))}
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white max-w-[430px] mx-auto px-4 pt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-white/5">
          <BookOpen size={24} className="text-ai-blue" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Academics</h1>
          <p className="text-sm text-white/50">{student?.semester || '5th Semester'}</p>
        </div>
      </div>

      {!selectedSubject && (
        <div className="glass p-1 rounded-xl mb-6 flex">
          {['subjects', 'schedule', 'performance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                activeView === tab 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSubject ? 'detail' : activeView}
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
