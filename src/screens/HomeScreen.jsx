import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, Calendar, ArrowRight, Laptop, Smartphone, FileText, CheckCircle2, AlertTriangle, ArrowDownUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { staggerContainer, slideUp } from '../utils/animations';
import { useNavigate, Link } from 'react-router-dom';

export default function HomeScreen() {
  const { student, laptopConnected } = useApp();
  const navigate = useNavigate();

  return (
    <motion.div 
      className="flex flex-col gap-6 px-4 py-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header & Greeting */}
      <motion.div variants={slideUp} className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-white/60 text-sm font-medium">Good morning,</h2>
          <h1 className="text-2xl font-bold text-white">{student.firstName}</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-ai-gradient p-0.5 shadow-glow-blue cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="w-full h-full bg-dark-900 rounded-full flex items-center justify-center font-bold text-white text-sm">
            AM
          </div>
        </div>
      </motion.div>

      {/* Hero AI Insight */}
      <motion.div variants={slideUp} className="glass-card p-5 ai-border bg-gradient-to-br from-ai-blue/10 to-ai-purple/10 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-ai-blue/20 blur-3xl rounded-full pointer-events-none"></div>
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-ai-blue" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Insight</h3>
        </div>
        <p className="text-lg font-medium text-white/90 leading-snug mb-4">
          <span className="text-ai-cyan">Scheduling</span> is becoming a priority because your OS exam is approaching and your recent quiz performance is low.
        </p>
          <Link 
            to="/ai-plan"
            className="bg-ai-blue/20 hover:bg-ai-blue/30 text-ai-blue text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors w-fit cursor-pointer relative z-10"
          >
            View Recommended Plan <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

      {/* Today's Focus */}
      <motion.div variants={slideUp}>
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">Today's Focus</h3>
        </div>
        <div className="space-y-2">
          {/* Item 1 */}
          <div className="glass-card p-3.5 flex items-center justify-between border-l-2 border-l-ai-purple">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-ai-purple/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-ai-purple" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">DBMS Assignment</p>
                <p className="text-[10px] font-medium text-white/40 uppercase">High Priority</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-ai-purple bg-ai-purple/10 px-2 py-1 rounded">45m</span>
            </div>
          </div>
          {/* Item 2 */}
          <div className="glass-card p-3.5 flex items-center justify-between border-l-2 border-l-ai-blue">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-ai-blue/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-ai-blue" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Round Robin Scheduling</p>
                <p className="text-[10px] font-medium text-white/40 uppercase">Operating Systems</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-ai-blue bg-ai-blue/10 px-2 py-1 rounded">30m</span>
            </div>
          </div>
          {/* Item 3 */}
          <div className="glass-card p-3.5 flex items-center justify-between border-l-2 border-l-ai-cyan">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-ai-cyan/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-ai-cyan" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">PBL API Integration</p>
                <p className="text-[10px] font-medium text-white/40 uppercase">AI/ML Project</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-ai-cyan bg-ai-cyan/10 px-2 py-1 rounded">60m</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid: Next Class & Upcoming */}
      <motion.div variants={slideUp} className="grid grid-cols-2 gap-3">
        {/* Next Class */}
        <div className="glass-card p-4 relative overflow-hidden border-t border-t-white/10">
          <div className="absolute right-0 top-0 w-16 h-16 bg-white/5 rounded-bl-full pointer-events-none"></div>
          <Clock className="w-5 h-5 text-white/40 mb-3" />
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">Next Class</h3>
          <p className="text-sm font-bold text-white">Operating Systems</p>
          <p className="text-xs font-medium text-ai-blue mt-1">10:00 AM</p>
        </div>

        {/* Upcoming */}
        <div className="glass-card p-4 relative overflow-hidden border-t border-t-accent-danger/20">
          <div className="absolute right-0 top-0 w-16 h-16 bg-accent-danger/5 rounded-bl-full pointer-events-none"></div>
          <Calendar className="w-5 h-5 text-accent-danger/60 mb-3" />
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">Upcoming</h3>
          <p className="text-sm font-bold text-white">OS Internal</p>
          <p className="text-xs font-medium text-accent-danger mt-1">Sept 22</p>
        </div>
      </motion.div>

      {/* Connected Workspace Card */}
      <motion.div variants={slideUp} onClick={() => navigate('/workspace')} className="glass-card p-4 cursor-pointer hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
            Connected Workspace <ArrowRight className="w-3 h-3 text-white/40" />
          </h3>
        </div>
        <div className="flex items-center justify-between px-2 bg-dark-800/50 py-3 rounded-xl border border-white/5">
          <div className="flex flex-col items-center gap-1">
            <Smartphone className="w-5 h-5 text-ai-blue" />
            <span className="text-[10px] font-bold text-white">iQOO Phone</span>
            <div className="w-1.5 h-1.5 rounded-full bg-accent-success"></div>
          </div>
          
          <div className="flex flex-col items-center px-4">
            <div className={`h-0.5 w-12 relative ${laptopConnected ? 'bg-gradient-to-r from-ai-blue via-ai-purple to-ai-cyan' : 'bg-white/10'}`}>
              {laptopConnected && <div className="absolute inset-0 bg-white/50 blur-[2px] animate-pulse"></div>}
            </div>
            <span className="text-[9px] font-bold text-white/50 uppercase mt-1">
              {laptopConnected ? 'Active Sync' : 'Offline'}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Laptop className={`w-5 h-5 ${laptopConnected ? 'text-ai-cyan' : 'text-white/20'}`} />
            <span className={`text-[10px] font-bold ${laptopConnected ? 'text-white' : 'text-white/40'}`}>
              {laptopConnected ? 'Laptop Connected' : 'Not Connected'}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${laptopConnected ? 'bg-accent-success animate-pulse' : 'bg-white/10'}`}></div>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
