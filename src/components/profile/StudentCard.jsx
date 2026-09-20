import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { fadeInUp } from '../../utils/animations';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

export default function StudentCard() {
  const { student } = useApp();
  
  if (!student) return null;

  return (
    <motion.div variants={fadeInUp} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-ai-blue/20 to-transparent" />
      
      <div className="relative z-10 mb-4 mt-2">
        <Avatar name={student.name} size="xl" />
      </div>
      
      <h2 className="text-2xl font-bold text-white relative z-10">{student.name}</h2>
      <p className="text-sm text-white/60 mt-1 relative z-10">{student.program} • {student.semester}</p>
      
      <div className="flex items-center justify-center gap-2 mt-4 relative z-10">
        <Badge variant="default" className="bg-white/10 text-white">
          {student.university}
        </Badge>
        <Badge variant="default" className="bg-white/5 text-white/50">
          ID: {student.enrollmentId}
        </Badge>
      </div>
      
      <div className="mt-6 w-full flex justify-between items-center glass p-3 rounded-xl relative z-10 border border-white/5">
        <span className="text-sm text-white/70">Current GPA</span>
        <span className="text-lg font-bold text-accent-success">{student.gpa}</span>
      </div>
    </motion.div>
  );
}
