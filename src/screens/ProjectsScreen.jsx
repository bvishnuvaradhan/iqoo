import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Folder, Clock, CheckCircle, Users, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectsScreen = () => {
  const { projects } = useApp();
  const [activeModal, setActiveModal] = useState(null);

  return (
    <div className="pt-safe pb-24 px-4 h-full overflow-y-auto relative">
      <div className="mt-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Projects & PBL
          </h1>
          <p className="text-white/50 text-sm mt-1">Contextual Project Intelligence</p>
        </div>
        <button 
          onClick={() => setActiveModal('new')}
          className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
        >
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
                <button 
                  onClick={() => setActiveModal('details')}
                  className="text-xs text-blue-400 font-medium hover:text-blue-300 transition-colors"
                >
                  View Details →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Mock Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-dark-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Background Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-ai-blue/10 blur-3xl rounded-full"></div>

              {activeModal === 'new' ? (
                <>
                  <div className="flex flex-col items-center justify-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-ai-blue/20 flex items-center justify-center mb-3 text-ai-blue">
                      <Folder size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Create Project</h2>
                    <p className="text-xs text-white/50 text-center mt-1">Connect a new project to your academic context.</p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1 block">Project Title</label>
                      <input type="text" disabled placeholder="e.g. Smart Campus Navigation" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white/50 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1 block">Connected Subjects</label>
                      <div className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white/30 cursor-not-allowed">
                        Select subjects...
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button onClick={() => setActiveModal(null)} className="flex-1 py-3 rounded-xl bg-white/5 text-white/70 font-semibold hover:bg-white/10 transition-colors text-sm">Cancel</button>
                    <button onClick={() => setActiveModal(null)} className="flex-[2] py-3 rounded-xl bg-ai-blue/50 text-white/50 font-bold cursor-not-allowed text-sm">Create Project</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold text-white">Project Analytics</h2>
                      <span className="text-[10px] bg-ai-purple/20 text-ai-purple px-2 py-0.5 rounded-full font-bold">PROTOTYPE</span>
                    </div>
                    <p className="text-sm text-white/60">AI Medical Prediction System</p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-xs font-semibold text-white/60">Sprint Velocity</span>
                      <span className="text-sm font-bold text-emerald-400">42 pts / wk</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-xs font-semibold text-white/60">Top Contributor</span>
                      <span className="text-sm font-bold text-ai-cyan">Priya</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-xs font-semibold text-white/60">AI Bottleneck Alert</span>
                      <span className="text-sm font-bold text-accent-danger">API Gateway</span>
                    </div>
                  </div>

                  <button onClick={() => setActiveModal(null)} className="w-full py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors text-sm">
                    Close Details
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsScreen;
