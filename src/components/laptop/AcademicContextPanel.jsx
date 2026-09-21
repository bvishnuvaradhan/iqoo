import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Circle, FileText } from 'lucide-react';
import { slideUp, staggerContainer } from '../../utils/animations';

export default function AcademicContextPanel({ studentData, onComplete }) {
  if (!studentData) return null;
  const { subjects } = studentData;

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="p-8 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Academic Context</h1>
        <p className="text-white/50 text-sm">Verified knowledge base driving your AI recommendations.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {subjects.map(subject => (
          <motion.div key={subject.id} variants={slideUp} className="glass-card border border-white/5 bg-dark-800/50 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between" style={{ backgroundColor: `${subject.color}10` }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: subject.color }}>
                  {subject.code.slice(0,2)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{subject.name}</h2>
                  <p className="text-sm text-white/50">{subject.code} • {subject.professor}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: subject.color }}>{subject.progress}%</p>
                <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Completion</p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Verified Topics</h3>
                <div className="space-y-2">
                  {subject.topics?.map(topic => (
                    <div key={topic.id} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => topic.status !== 'completed' && onComplete('topic', topic.id)}
                          className={`transition-colors ${topic.status === 'completed' ? 'text-accent-success cursor-default' : 'text-white/20 hover:text-white cursor-pointer'}`}
                        >
                          {topic.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </button>
                        <div>
                          <p className={`text-sm font-medium ${topic.status === 'completed' ? 'text-white/60 line-through' : 'text-white'}`}>{topic.name}</p>
                          <p className="text-xs text-white/40">{topic.module_name}</p>
                        </div>
                      </div>
                      {topic.importance === 'high' && <span className="bg-accent-warning/10 text-accent-warning text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">High</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Reference Materials</h3>
                <div className="space-y-2">
                  {subject.materials?.map(mat => (
                    <div key={mat.id} className="flex items-start gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                      <FileText className="w-5 h-5 text-ai-cyan shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-white">{mat.title}</p>
                        <p className="text-xs text-white/50 capitalize mb-1">{mat.type}</p>
                        <p className="text-xs text-white/40 line-clamp-2">{mat.content_snippet}</p>
                      </div>
                    </div>
                  ))}
                  {(!subject.materials || subject.materials.length === 0) && (
                    <p className="text-sm text-white/30">No materials indexed yet.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
