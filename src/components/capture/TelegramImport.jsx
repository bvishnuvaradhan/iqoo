import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Upload, X, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import { fadeIn, slideUp } from '../../utils/animations';

export default function TelegramImport() {
  const { advanceTelegramStep, resetTelegramFlow } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? (['localhost', '127.0.0.1'].includes(window.location.hostname) ? `http://${window.location.hostname}:8000` : '')}/api/telegram/analyze`, {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to process Telegram JSON.");
      
      advanceTelegramStep('review', data);
      
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      className="flex flex-col h-full bg-dark-950 px-6 pt-12 pb-24 max-w-[430px] mx-auto relative"
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <button 
        onClick={resetTelegramFlow}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
        disabled={isProcessing}
      >
        <X className="w-5 h-5" />
      </button>

      <motion.div variants={slideUp} className="text-center mt-12 mb-10">
        <div className="w-16 h-16 rounded-full bg-[#2AABEE]/10 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-[#2AABEE]" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Telegram Intelligence</h1>
        <p className="text-sm text-white/60">Upload your Telegram Desktop JSON export. Nexora will find academic context in the chaos.</p>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-accent-danger/10 border border-accent-danger/20 rounded-xl p-4 mb-8 text-center flex flex-col items-center gap-2">
          <AlertCircle className="w-5 h-5 text-accent-danger" />
          <p className="text-sm text-accent-danger font-medium">{error}</p>
        </motion.div>
      )}

      <motion.div variants={slideUp} className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-6 bg-white/5 relative group hover:border-[#2AABEE]/50 transition-colors">
        {isProcessing ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-[#2AABEE] animate-spin mb-4" />
            <p className="text-sm font-bold text-white mb-1">Scanning Messages...</p>
            <p className="text-xs text-white/50">This may take a moment.</p>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-white/30 mb-4 group-hover:text-[#2AABEE] transition-colors" />
            <p className="text-sm font-bold text-white mb-1">Tap to select JSON file</p>
            <p className="text-xs text-white/40 text-center max-w-[200px]">Export from Telegram Desktop Settings &rarr; Advanced &rarr; Export Telegram Data</p>
            <input 
              type="file" 
              accept="application/json"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
