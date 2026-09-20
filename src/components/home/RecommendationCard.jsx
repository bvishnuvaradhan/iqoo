import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import AIIndicator from '../common/AIIndicator';

const RecommendationCard = ({ recommendation }) => {
  const [expanded, setExpanded] = useState(false);

  if (!recommendation) return null;

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return <Badge variant="danger" className="text-[10px]">High Priority</Badge>;
      case 'medium': return <Badge variant="warning" className="text-[10px]">Medium Priority</Badge>;
      case 'low': return <Badge variant="default" className="text-[10px]">Low Priority</Badge>;
      default: return null;
    }
  };

  return (
    <Card variant="ai" className="ai-border overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <Brain size={16} className="text-ai-purple" />
          <span className="text-xs font-semibold text-gradient">AI Recommendation</span>
        </div>
        {getPriorityBadge(recommendation.priority)}
      </div>

      <div className="mb-3">
        <h4 className="text-base font-semibold text-white mb-1">{recommendation.title}</h4>
        <p className="text-sm text-white/60">{recommendation.description}</p>
        
        {recommendation.subject && (
          <p className="text-xs text-white/40 mt-1">Subject: {recommendation.subject}</p>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-xs text-white/50 space-x-1">
          <Clock size={12} />
          <span>Est. {recommendation.estimatedTime}</span>
        </div>
        <Button variant="primary" size="sm" className="px-4 py-1.5 text-xs">
          {recommendation.actionLabel}
        </Button>
      </div>

      <div className="border-t border-white/10 pt-3">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          <span>Why this?</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-white/70 mt-3 p-2 bg-white/5 rounded-lg">
                {recommendation.reason}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default RecommendationCard;
