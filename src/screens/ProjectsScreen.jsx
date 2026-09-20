import React from 'react';
import { useApp } from '../context/AppContext';
import { Folder, Clock, CheckCircle, Users, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectsScreen = () => {
  const { projects } = useApp();

  return (
    <div className="pt-safe pb-24 px-4 h-full overflow-y-auto">
      <div className="mt-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Projects & PBL
          </h1>
          <p className="text-white/50 text-sm mt-1">Contextual Project Intelligence</p>
        </div>
        <button className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium border border-blue-500/30">
          + New
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center text-white/50 py-10">No active projects found.</div>
      ) : (
        <div className="space-y-4">
          {projects.map(proj => (
            <motion.div 
              key={proj.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-2xl border border-white/10 p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${proj.status === 'AT RISK' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {proj.status === 'AT RISK' ? <AlertTriangle size={20} /> : <Folder size={20} />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{proj.name}</h3>
                    <p className="text-xs text-white/50">Due {proj.deadline}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{proj.calculatedProgress}%</div>
                  <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    proj.status === 'AT RISK' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {proj.status}
                  </div>
                </div>
              </div>

              {proj.status === 'AT RISK' && (
                <div className="mb-4 text-xs text-red-300 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                  <span className="font-semibold">Risk:</span> {proj.riskReason}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {proj.subjects?.map(s => (
                  <span key={s.id} className="text-[10px] bg-white/10 text-white/70 px-2 py-1 rounded">
                    {s.name}
                  </span>
                ))}
              </div>

              <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-semibold text-white/70">Tasks</h4>
                  <span className="text-[10px] text-white/50">{proj.tasks.filter(t=>t.status==='Completed').length}/{proj.tasks.length} Completed</span>
                </div>
                <div className="space-y-2">
                  {proj.tasks.map(task => (
                    <div key={task.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 truncate">
                        {task.status === 'Completed' ? (
                          <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Clock size={14} className="text-blue-400 flex-shrink-0" />
                        )}
                        <span className={`truncate ${task.status === 'Completed' ? 'text-white/40 line-through' : 'text-white/90'}`}>
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {task.priority === 'high' && task.status !== 'Completed' && (
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        )}
                        <span className="text-[10px] text-white/40">{task.assignee}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs text-white/60">
                  <Users size={14} />
                  <span>{proj.members?.length} Members</span>
                </div>
                <button className="text-xs text-blue-400 font-medium">View Details →</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsScreen;
