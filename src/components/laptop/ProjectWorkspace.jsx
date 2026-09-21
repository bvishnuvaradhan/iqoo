import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, AlertTriangle, CheckSquare, Square, Users, Calendar } from 'lucide-react';
import { slideUp, staggerContainer } from '../../utils/animations';

export default function ProjectWorkspace({ studentData, onComplete }) {
  if (!studentData) return null;
  const { projects } = studentData;

  const project = projects?.[0]; // Focus on primary project for demo
  
  if (!project) return (
    <div className="p-8 text-center text-white/40">No active projects found.</div>
  );

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="p-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FolderGit2 className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Project Workspace</h1>
          </div>
          <h2 className="text-xl font-bold text-white/80">{project.name}</h2>
          <p className="text-white/50 text-sm mt-1 max-w-2xl">{project.description}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-black/30 border border-white/5 px-4 py-2 rounded-xl text-center min-w-[100px]">
            <p className="text-xs font-bold text-white/40 uppercase">Deadline</p>
            <p className="text-sm font-bold text-white">{project.deadline}</p>
          </div>
          <div className={`border px-4 py-2 rounded-xl text-center min-w-[100px] ${project.status === 'AT RISK' ? 'bg-accent-error/10 border-accent-error/20' : 'bg-accent-success/10 border-accent-success/20'}`}>
            <p className={`text-xs font-bold uppercase ${project.status === 'AT RISK' ? 'text-accent-error' : 'text-accent-success'}`}>Status</p>
            <p className="text-sm font-bold text-white">{project.status}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Task List */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={slideUp} className="glass-card p-6 border border-white/5 bg-dark-800/50 rounded-3xl">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6">Project Tasks</h3>
            <div className="space-y-3">
              {project.tasks?.map(task => {
                const isComplete = task.status === 'Completed';
                return (
                  <div key={task.id} className={`p-4 rounded-2xl border transition-colors ${isComplete ? 'bg-black/20 border-white/5' : 'bg-black/40 border-white/10 hover:border-white/20'}`}>
                    <div className="flex items-start gap-4">
                      <button 
                        onClick={() => onComplete('project_task', task.id, isComplete ? 'uncomplete' : 'complete')}
                        className={`mt-1 shrink-0 ${isComplete ? 'text-accent-success cursor-pointer hover:text-white transition-colors' : 'text-white/30 hover:text-white transition-colors cursor-pointer'}`}
                      >
                        {isComplete ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-bold ${isComplete ? 'text-white/50 line-through' : 'text-white'}`}>{task.title}</h4>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            task.priority === 'high' ? 'bg-accent-warning/20 text-accent-warning' : 'bg-white/10 text-white/50'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className={`text-xs mb-3 ${isComplete ? 'text-white/30' : 'text-white/60'}`}>{task.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs font-medium">
                           <span className="flex items-center gap-1.5 text-blue-300/70 bg-blue-500/10 px-2 py-1 rounded-md">
                             <Users className="w-3 h-3" /> {task.assignee}
                           </span>
                           <span className="flex items-center gap-1.5 text-white/40">
                             <Calendar className="w-3 h-3" /> Due {task.deadline}
                           </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <motion.div variants={slideUp} className="glass-card p-6 border border-white/5 bg-dark-800/50 rounded-3xl">
             <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Progress</h3>
             <div className="flex justify-between items-end mb-2">
               <span className="text-3xl font-bold text-white">{project.calculatedProgress}%</span>
               <span className="text-xs text-white/50 mb-1">{project.tasks?.filter(t => t.status === 'Completed').length} of {project.tasks?.length} tasks</span>
             </div>
             <div className="w-full bg-black/50 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${project.calculatedProgress}%` }}></div>
             </div>
             
             {project.status === 'AT RISK' && (
               <div className="mt-6 bg-accent-error/10 border border-accent-error/20 p-4 rounded-xl">
                 <div className="flex items-center gap-2 mb-2 text-accent-error">
                   <AlertTriangle className="w-4 h-4" />
                   <p className="text-sm font-bold uppercase tracking-widest">Risk Detected</p>
                 </div>
                 <p className="text-xs text-accent-error/80">{project.riskReason}</p>
               </div>
             )}
          </motion.div>

          <motion.div variants={slideUp} className="glass-card p-6 border border-white/5 bg-dark-800/50 rounded-3xl">
             <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Users className="w-4 h-4" /> Team
             </h3>
             <div className="space-y-3">
               {project.members?.map(member => (
                 <div key={member.id} className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/80">
                     {member.name.split(' ').map(n => n[0]).join('')}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-white">{member.name}</p>
                     <p className="text-xs text-white/50">{member.role}</p>
                   </div>
                 </div>
               ))}
             </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
