import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Mic, Image as ImageIcon, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getRelativeTime } from '../../utils/helpers';
import { fadeIn } from '../../utils/animations';
import Badge from '../common/Badge';

const RecentCaptures = () => {
  const { captures } = useApp();
  
  const recentCaptures = captures.slice(0, 6);

  const getIcon = (type) => {
    switch (type) {
      case 'camera': return <Camera size={16} className="text-ai-blue" />;
      case 'voice': return <Mic size={16} className="text-ai-purple" />;
      case 'screenshot': return <ImageIcon size={16} className="text-ai-cyan" />;
      case 'document': return <FileText size={16} className="text-accent-warning" />;
      default: return <FileText size={16} className="text-white" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'camera': return 'bg-ai-blue/20';
      case 'voice': return 'bg-ai-purple/20';
      case 'screenshot': return 'bg-ai-cyan/20';
      case 'document': return 'bg-accent-warning/20';
      default: return 'bg-white/20';
    }
  };

  if (recentCaptures.length === 0) return null;

  return (
    <motion.div variants={fadeIn} className="w-full">
      <div className="flex items-center mb-3">
        <h3 className="text-base font-semibold text-white mr-2">Recent Captures</h3>
        <Badge variant="default" className="text-[10px] px-1.5 py-0.5 rounded-md">
          {captures.length}
        </Badge>
      </div>

      <div className="flex overflow-x-auto gap-3 pb-2 snap-x hide-scrollbar">
        {recentCaptures.map((capture, index) => {
          const isHighConfidence = capture.aiConfidence > 0.9;
          
          return (
            <div 
              key={capture.id || index} 
              className="glass-card w-36 shrink-0 p-3 flex flex-col justify-between snap-start"
            >
              <div className="flex justify-between items-start mb-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${getIconBg(capture.type)}`}>
                  {getIcon(capture.type)}
                </div>
                <div 
                  className={`w-1.5 h-1.5 rounded-full ${isHighConfidence ? 'bg-accent-success' : 'bg-accent-warning'}`} 
                  title={`AI Confidence: ${capture.aiConfidence}`}
                />
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-white line-clamp-2 mb-1">
                  {capture.title}
                </h4>
                <p className="text-[10px] text-white/40 truncate">
                  {capture.subject}
                </p>
                <p className="text-[10px] text-white/30 mt-1">
                  {getRelativeTime(capture.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RecentCaptures;
