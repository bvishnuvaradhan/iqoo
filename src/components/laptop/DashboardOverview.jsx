import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, AlertTriangle, ArrowRight, Activity, TrendingUp, CheckCircle, Brain } from 'lucide-react';
import { slideUp, staggerContainer } from '../../utils/animations';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function DashboardOverview({ studentData, recommendations, onComplete }) {
  if (!studentData) return <div className="p-8 text-white/50">Loading dashboard data...</div>;

  const { subjects, projects } = studentData;
  const topRecs = recommendations.slice(0, 3);
  
  // Flatten upcoming items
  let upcoming = [];
  subjects.forEach(sub => {
    sub.upcomingItems?.forEach(item => {
      upcoming.push({ ...item, subjectCode: sub.code, subjectColor: sub.color });
    });
  });
  upcoming = upcoming.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4);

  // Active project
  const activeProj = projects?.[0];

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="p-8 max-w-7xl mx-auto space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Tasks & Upcoming */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={slideUp} className="glass-card p-6 border border-white/5 bg-dark-800/50 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ai-blue/5 blur-3xl rounded-full"></div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Upcoming Deadlines
              </h2>
            </div>
            
            {upcoming.length === 0 ? (
              <p className="text-white/40 text-sm">No upcoming items.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map(item => (
                  <div key={item.id} className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: item.subjectColor }}></div>
                      <div>
                        <p className="font-bold text-white text-sm">{item.title}</p>
                        <p className="text-xs text-white/50 uppercase">{item.subjectCode} • {item.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-ai-cyan font-bold bg-ai-cyan/10 px-2 py-1 rounded-md">{item.date}</p>
                      </div>
                      <button 
                        onClick={() => onComplete('upcoming_item', item.id)}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-accent-success/20 hover:text-accent-success flex items-center justify-center text-white/40 transition-colors"
                        title="Mark Complete"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div variants={slideUp} className="glass-card p-6 border border-white/5 bg-dark-800/50 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-ai-purple/5 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-2 mb-6 text-sm font-bold text-white/50 uppercase tracking-widest">
              <Brain className="w-4 h-4 text-ai-purple" /> Top AI Recommendations
            </div>
            
            {topRecs.length === 0 ? (
              <p className="text-white/40 text-sm">No recommendations currently available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topRecs.map(rec => (
                  <div key={rec.id} className="bg-black/40 border border-ai-purple/20 p-4 rounded-2xl">
                    <p className="text-xs text-ai-purple font-bold mb-1">{rec.subject}</p>
                    <p className="font-bold text-white text-sm mb-2 line-clamp-2">{rec.title}</p>
                    <p className="text-xs text-white/50 flex items-center gap-1 mb-4">
                       ⏱ {rec.durationMinutes} mins
                    </p>
                    <button className="w-full bg-ai-purple/10 hover:bg-ai-purple/20 text-ai-purple text-xs font-bold py-2 rounded-lg transition-colors">
                      {rec.actionLabel}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Col - Progress & Project */}
        <div className="space-y-6">
          <motion.div variants={slideUp} className="glass-card p-6 border border-white/5 bg-dark-800/50 rounded-3xl">
             <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Academic Progress
             </h2>
             <div className="h-64 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={subjects.map(sub => ({ subject: sub.code, progress: sub.progress, fullMark: 100 }))}>
                    <PolarGrid stroke="#ffffff20" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff80', fontSize: 11, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                      itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                      formatter={(value) => [`${value}%`, 'Progress']}
                    />
                    <Radar name="Progress" dataKey="progress" stroke="#06b6d4" strokeWidth={2} fill="#06b6d4" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
          </motion.div>

          {activeProj && (
            <motion.div variants={slideUp} className="glass-card p-6 border border-white/5 bg-dark-800/50 rounded-3xl relative">
              <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Active Project</h2>
              <h3 className="text-lg font-bold text-white mb-2 leading-tight">{activeProj.name}</h3>
              
              <div className="flex justify-between text-xs text-white/70 mb-2 mt-4">
                <span>Overall Progress</span>
                <span className="text-white font-bold">{activeProj.calculatedProgress}%</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2 mb-4">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${activeProj.calculatedProgress}%` }}></div>
              </div>

              {activeProj.status === 'AT RISK' && (
                <div className="bg-accent-error/10 border border-accent-error/20 p-3 rounded-xl flex items-start gap-2 mt-4">
                  <AlertTriangle className="w-4 h-4 text-accent-error shrink-0 mt-0.5" />
                  <p className="text-xs text-accent-error">{activeProj.riskReason}</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
