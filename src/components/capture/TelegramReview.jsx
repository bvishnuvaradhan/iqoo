import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Check, X, Shield, MessageSquare, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { fadeIn, slideUp, staggerContainer } from '../../utils/animations';

export default function TelegramReview() {
  const { telegramFlow, resetTelegramFlow, pairingCode } = useApp();
  const { telegramData } = telegramFlow;
  
  const [items, setItems] = useState(telegramData?.categorizedItems || {
    newItems: [], updates: [], duplicates: [], conflicts: [], uncertain: []
  });
  
  const [acceptedItems, setAcceptedItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!telegramData) return null;

  const handleAcceptItem = (item) => {
    setAcceptedItems(prev => [...prev, item]);
    removeItemFromList(item);
  };

  const handleRejectItem = (item) => {
    removeItemFromList(item);
  };

  const removeItemFromList = (item) => {
    const vState = item.verification.verificationState;
    setItems(prev => {
      const copy = { ...prev };
      if (vState === 'NEW') copy.newItems = copy.newItems.filter(i => i !== item);
      if (vState === 'UPDATE') copy.updates = copy.updates.filter(i => i !== item);
      if (vState === 'CONFLICT') copy.conflicts = copy.conflicts.filter(i => i !== item);
      if (vState === 'UNCERTAIN') copy.uncertain = copy.uncertain.filter(i => i !== item);
      return copy;
    });
  };

  const acceptAllNew = () => {
    setAcceptedItems(prev => [...prev, ...items.newItems]);
    setItems(prev => ({ ...prev, newItems: [] }));
  };

  const submitAccepted = async () => {
    if (acceptedItems.length === 0) {
      resetTelegramFlow();
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Map back to expected structure for /api/telegram/accept
      const payload = acceptedItems.map(item => ({
        subject: item.subject,
        topic: item.activity,
        itemType: item.verification.match?.itemType || item.type,
        targetDate: item.deadline,
        confidence: item.confidence,
        isVerified: true,
        verificationState: item.verification.verificationState,
        changes: item.verification.changes,
        itemId: item.verification.match?.itemId,
        sourceMessageIds: item.sourceMessageIds
      }));

      const res = await fetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`}/api/telegram/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload, pairingCode }) 
      });
      
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => resetTelegramFlow(), 2000);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  // Renders a single source message
  const SourceMessage = ({ text }) => (
    <div className="mt-3 bg-black/20 p-3 rounded-lg border border-white/5 relative">
      <MessageSquare className="w-3 h-3 absolute top-3 left-3 text-white/30" />
      <p className="text-xs text-white/60 pl-6 italic">"{text}"</p>
    </div>
  );

  return (
    <motion.div 
      className="flex flex-col h-full bg-dark-950 px-5 pt-8 pb-24 max-w-[430px] mx-auto overflow-y-auto"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2AABEE]/10 text-[#2AABEE] rounded-full flex items-center justify-center border border-[#2AABEE]/20">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">Telegram Review</h1>
        </div>
      </div>

      <motion.div variants={slideUp} className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex-shrink-0">
          <p className="text-[10px] text-white/50 uppercase font-bold">Scanned</p>
          <p className="text-lg font-bold text-white">{telegramData.scannedCount}</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex-shrink-0">
          <p className="text-[10px] text-white/50 uppercase font-bold">Relevant</p>
          <p className="text-lg font-bold text-white">{telegramData.relevantCount}</p>
        </div>
        <div className="bg-accent-success/10 border border-accent-success/20 px-4 py-2 rounded-xl flex-shrink-0">
          <p className="text-[10px] text-accent-success uppercase font-bold">New</p>
          <p className="text-lg font-bold text-accent-success">{items.newItems.length}</p>
        </div>
        <div className="bg-ai-cyan/10 border border-ai-cyan/20 px-4 py-2 rounded-xl flex-shrink-0">
          <p className="text-[10px] text-ai-cyan uppercase font-bold">Updates</p>
          <p className="text-lg font-bold text-ai-cyan">{items.updates.length}</p>
        </div>
      </motion.div>

      {/* NEW ITEMS */}
      {items.newItems.length > 0 && (
        <motion.div variants={slideUp} className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-accent-success uppercase tracking-wider">New Information ({items.newItems.length})</h2>
            <button onClick={acceptAllNew} className="text-xs font-bold text-accent-success bg-accent-success/10 px-3 py-1 rounded-full">Accept All</button>
          </div>
          <div className="space-y-4">
            {items.newItems.map((item, idx) => (
              <div key={idx} className="glass-card border border-accent-success/20 p-4 bg-accent-success/5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white">{item.subject} {item.activity}</h3>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/70">{item.deadline}</span>
                </div>
                {item.sourceMessages?.[0] && <SourceMessage text={item.sourceMessages[0].text} />}
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleRejectItem(item)} className="flex-1 py-2 rounded-lg bg-white/5 text-white/60 text-xs font-bold hover:bg-white/10"><X className="w-4 h-4 mx-auto"/></button>
                  <button onClick={() => handleAcceptItem(item)} className="flex-[3] py-2 rounded-lg bg-accent-success/20 text-accent-success text-xs font-bold hover:bg-accent-success/30"><Check className="w-4 h-4 mx-auto"/></button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* UPDATES */}
      {items.updates.length > 0 && (
        <motion.div variants={slideUp} className="mb-8">
          <h2 className="text-sm font-bold text-ai-cyan uppercase tracking-wider mb-3">Updates Detected ({items.updates.length})</h2>
          <div className="space-y-4">
            {items.updates.map((item, idx) => (
              <div key={idx} className="glass-card border border-ai-cyan/20 p-4 bg-ai-cyan/5">
                <h3 className="font-bold text-white mb-3">{item.verification.match?.topic || item.activity}</h3>
                
                {item.verification.changes?.map((change, cIdx) => (
                  <div key={cIdx} className="bg-black/30 p-3 rounded-lg border border-white/5 flex items-center justify-between mb-3">
                    <span className="text-xs text-white/50 line-through">{change.old}</span>
                    <ArrowRight className="w-4 h-4 text-ai-cyan mx-2" />
                    <span className="text-xs font-bold text-ai-cyan">{change.new}</span>
                  </div>
                ))}

                {item.sourceMessages?.[0] && <SourceMessage text={item.sourceMessages[0].text} />}
                
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleRejectItem(item)} className="flex-1 py-2 rounded-lg bg-white/5 text-white/60 text-xs font-bold hover:bg-white/10">Reject</button>
                  <button onClick={() => handleAcceptItem(item)} className="flex-[2] py-2 rounded-lg bg-ai-cyan text-black text-xs font-bold hover:brightness-110">Accept Update</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* CONFLICTS */}
      {items.conflicts.length > 0 && (
        <motion.div variants={slideUp} className="mb-8">
          <h2 className="text-sm font-bold text-accent-danger uppercase tracking-wider mb-3">Conflicts ({items.conflicts.length})</h2>
          <div className="space-y-4">
            {items.conflicts.map((item, idx) => (
              <div key={idx} className="glass-card border border-accent-danger/20 p-4 bg-accent-danger/5">
                <h3 className="font-bold text-white mb-2">{item.activity}</h3>
                <p className="text-xs text-accent-danger mb-3">{item.verification.reason}</p>
                {item.sourceMessages?.[0] && <SourceMessage text={item.sourceMessages[0].text} />}
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleRejectItem(item)} className="flex-1 py-2 rounded-lg bg-white/5 text-white/60 text-xs font-bold hover:bg-white/10">Reject</button>
                  <button onClick={() => handleAcceptItem(item)} className="flex-[2] py-2 rounded-lg bg-accent-danger text-white text-xs font-bold hover:brightness-110">Force Update</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* DUPLICATES (Read Only Summary) */}
      {items.duplicates.length > 0 && (
        <motion.div variants={slideUp} className="mb-8 opacity-70">
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Duplicates Ignored ({items.duplicates.length})</h2>
          <div className="space-y-2">
            {items.duplicates.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/5">
                <span className="text-xs text-white/60">{item.activity}</span>
                <span className="text-[10px] text-ai-purple bg-ai-purple/10 px-1.5 rounded">Duplicate</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* FIXED BOTTOM BAR */}
      <div className="fixed bottom-[80px] left-0 right-0 max-w-[430px] mx-auto px-5 bg-gradient-to-t from-dark-950 via-dark-950 to-transparent pb-4 pt-12">
        <button 
          onClick={submitAccepted}
          disabled={isSubmitting || submitted}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            submitted ? 'bg-accent-success text-white' : 
            isSubmitting ? 'bg-white/10 text-white/50' : 
            'bg-[#2AABEE] text-white hover:brightness-110 shadow-[0_0_20px_rgba(42,171,238,0.4)]'
          }`}
        >
          {submitted ? (
            <><Check className="w-5 h-5" /> Done</>
          ) : isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
          ) : (
            `Apply ${acceptedItems.length} Changes`
          )}
        </button>
      </div>
    </motion.div>
  );
}
