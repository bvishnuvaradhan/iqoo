import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Bell, Database, Download, Trash2 } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import Button from '../common/Button';

export default function Settings() {
  const [toggles, setToggles] = useState({
    autoProcess: true,
    smartRecs: true,
    voiceTrans: true,
    deadlines: true,
    aiInsights: true,
    syncAlerts: false
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleSwitch = ({ label, isChecked, onChange }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-white/80">{label}</span>
      <button 
        onClick={onChange}
        className={`w-10 h-6 rounded-full relative transition-colors ${isChecked ? 'bg-ai-blue' : 'bg-dark-800'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isChecked ? 'left-5' : 'left-1'}`} />
      </button>
    </div>
  );

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-4 pb-10">
      <motion.div variants={fadeInUp} className="glass-card p-5 rounded-2xl">
        <div className="flex items-center gap-2 mb-4 text-white">
          <Brain size={18} className="text-ai-purple" />
          <h3 className="font-semibold text-sm">AI Preferences</h3>
        </div>
        <div className="flex flex-col gap-1">
          <ToggleSwitch label="Auto-process captures" isChecked={toggles.autoProcess} onChange={() => handleToggle('autoProcess')} />
          <ToggleSwitch label="Smart recommendations" isChecked={toggles.smartRecs} onChange={() => handleToggle('smartRecs')} />
          <ToggleSwitch label="Voice transcription" isChecked={toggles.voiceTrans} onChange={() => handleToggle('voiceTrans')} />
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="glass-card p-5 rounded-2xl">
        <div className="flex items-center gap-2 mb-4 text-white">
          <Bell size={18} className="text-accent-warning" />
          <h3 className="font-semibold text-sm">Notifications</h3>
        </div>
        <div className="flex flex-col gap-1">
          <ToggleSwitch label="Deadline reminders" isChecked={toggles.deadlines} onChange={() => handleToggle('deadlines')} />
          <ToggleSwitch label="AI insights" isChecked={toggles.aiInsights} onChange={() => handleToggle('aiInsights')} />
          <ToggleSwitch label="Sync alerts" isChecked={toggles.syncAlerts} onChange={() => handleToggle('syncAlerts')} />
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="glass-card p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4 text-white">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-white/60" />
            <h3 className="font-semibold text-sm">Data & Storage</h3>
          </div>
          <span className="text-xs text-white/50">142 MB / 1 GB</span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-2">
            <Download size={14} /> Export Data
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 flex items-center justify-center gap-2 text-accent-danger border border-accent-danger/20 hover:bg-accent-danger/10">
            <Trash2 size={14} /> Clear Cache
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
