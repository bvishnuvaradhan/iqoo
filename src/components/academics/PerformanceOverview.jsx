import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Camera, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function PerformanceOverview() {
  const { student, subjects, captures } = useApp();

  const onTrackCount = subjects?.filter(s => s.progress >= 70).length || 0;
  const behindCount = subjects?.filter(s => s.progress < 70).length || 0;
  const totalCaptures = captures?.length || 24;

  const chartData = subjects?.map(sub => ({
    subject: sub.code,
    progress: sub.progress,
    fullMark: 100
  })) || [];

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 pb-20"
    >
      <motion.div variants={fadeInUp} className="glass-card p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-white/50 mb-1">Cumulative GPA</h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-white">{student?.gpa || '8.72'}</span>
            <div className="flex items-center gap-1 text-accent-success bg-accent-success/10 px-2 py-1 rounded-lg text-sm font-medium mb-1">
              <TrendingUp size={16} />
              <span>+0.15</span>
            </div>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-ai-blue/20 flex items-center justify-center text-ai-blue">
          <Award size={24} />
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-white/70 mb-1">
            <Camera size={16} />
            <span className="text-sm">Knowledge Captures</span>
          </div>
          <span className="text-2xl font-bold text-white">{totalCaptures}</span>
          <span className="text-xs text-white/40">This semester</span>
        </div>
        <div className="glass-card p-4 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-white/70 mb-1">
            <BookOpen size={16} />
            <span className="text-sm">Course Status</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-lg font-bold text-accent-success">{onTrackCount}</span>
            <span className="text-xs text-white/40">on track</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-lg font-bold text-accent-warning">{behindCount}</span>
            <span className="text-xs text-white/40">behind</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="glass-card p-5 rounded-2xl flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-white">Subject Progress Overview</h3>
        <div className="h-64 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="#ffffff20" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff80', fontSize: 11, fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                formatter={(value) => [`${value}%`, 'Progress']}
              />
              <Radar 
                name="Progress" 
                dataKey="progress" 
                stroke="#06b6d4" 
                strokeWidth={2}
                fill="#06b6d4" 
                fillOpacity={0.4} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
