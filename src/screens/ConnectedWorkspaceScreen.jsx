import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Laptop, Smartphone, Copy, FileUp, MonitorSmartphone, ArrowDownUp, CheckCircle, SmartphoneNfc } from 'lucide-react';
import { slideUp, staggerContainer } from '../utils/animations';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ConnectedWorkspaceScreen() {
  const navigate = useNavigate();
  const { syncStatus, pairingCode, laptopConnected, requestPairingCode, disconnectWorkspace, sendClipboard, sendFile } = useApp();
  const [clipboardText, setClipboardText] = useState("");
  const [fileInput, setFileInput] = useState(null);

  const handleSendClipboard = () => {
    if (clipboardText.trim()) {
      sendClipboard(clipboardText);
      setClipboardText("");
    }
  };

  const handleSendFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        sendFile(reader.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      className="flex flex-col h-full px-4 pt-6 pb-24 max-w-[430px] mx-auto overflow-y-auto"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={slideUp} className="flex items-center gap-3 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center text-white bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-md rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-white tracking-wide">Connected Workspace</h1>
      </motion.div>

      {/* Connection visualization */}
      <motion.div variants={slideUp} className="glass-card p-6 ai-border relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-ai-blue/10 blur-3xl rounded-full"></div>
        
        <div className="flex flex-col items-center justify-center space-y-3 relative z-10 py-4">
          {/* Phone */}
          <div className="flex items-center justify-center gap-4 w-full px-4 py-3 rounded-2xl bg-dark-800/80 border border-white/5 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-ai-blue/20 flex items-center justify-center text-ai-blue shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-white">Nexora Mobile</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'CONNECTED' ? 'bg-accent-success animate-pulse' : 'bg-accent-warning'}`}></div>
                <p className={`text-xs font-medium uppercase tracking-wider ${syncStatus === 'CONNECTED' ? 'text-accent-success' : 'text-accent-warning'}`}>
                  {syncStatus}
                </p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {!pairingCode && syncStatus === 'CONNECTED' && (
              <motion.button 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onClick={requestPairingCode}
                className="w-full mt-4 py-3 rounded-xl bg-ai-purple/20 text-ai-purple font-bold flex items-center justify-center gap-2 border border-ai-purple/30 hover:bg-ai-purple/30 transition-colors"
              >
                <SmartphoneNfc className="w-5 h-5" /> Generate Pairing Code
              </motion.button>
            )}

            {pairingCode && !laptopConnected && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full py-6 flex flex-col items-center justify-center bg-black/40 rounded-2xl border border-white/10 my-4"
              >
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Pairing Code</p>
                <p className="text-3xl font-mono font-bold tracking-widest text-ai-cyan drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">{pairingCode}</p>
                <p className="text-xs text-white/40 mt-3">Enter this code on your laptop.</p>
              </motion.div>
            )}

            {laptopConnected && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                {/* Connection Link */}
                <div className="flex flex-col items-center py-2">
                  <div className="h-5 w-px bg-gradient-to-b from-ai-blue to-ai-purple"></div>
                  <div className="text-[10px] font-bold text-white uppercase tracking-widest bg-dark-900 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-lg z-10">
                    <ArrowDownUp className="w-3 h-3 text-ai-purple" /> Active Sync
                  </div>
                  <div className="h-5 w-px bg-gradient-to-t from-ai-purple to-ai-cyan"></div>
                </div>

                {/* Laptop */}
                <div className="flex items-center justify-center gap-4 w-full px-4 py-3 rounded-2xl bg-dark-800/80 border border-white/5 shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-ai-cyan/20 flex items-center justify-center text-ai-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-white">Laptop connected</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-success animate-pulse"></div>
                      <p className="text-xs text-accent-success font-medium uppercase tracking-wider">Syncing</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={disconnectWorkspace}
                  className="mt-6 text-xs font-bold text-accent-danger/80 uppercase tracking-widest px-4 py-2 rounded-full border border-accent-danger/30 hover:bg-accent-danger/10 transition-colors"
                >
                  Disconnect
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Sync Capabilities (only active when paired) */}
      <motion.div variants={slideUp} className={`mb-8 transition-opacity duration-500 ${laptopConnected ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4 px-1">Live Capabilities</h3>
        
        <div className="space-y-3">
          {/* Clipboard Sync */}
          <div className="glass-card p-4 flex flex-col gap-3 border-l-4 border-l-ai-blue bg-dark-800/40">
            <div className="flex items-center gap-2">
              <Copy className="w-5 h-5 text-ai-blue" />
              <span className="text-sm font-semibold text-white/90">Shared Clipboard</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={clipboardText}
                onChange={(e) => setClipboardText(e.target.value)}
                placeholder="Type text to send..."
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-ai-blue transition-colors"
              />
              <button 
                onClick={handleSendClipboard}
                className="bg-ai-blue text-white px-4 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(59,130,246,0.4)]"
              >
                Send
              </button>
            </div>
          </div>

          {/* File Transfer */}
          <div className="glass-card p-4 flex flex-col gap-3 border-l-4 border-l-ai-purple bg-dark-800/40 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <FileUp className="w-5 h-5 text-ai-purple" />
              <span className="text-sm font-semibold text-white/90">File Transfer</span>
            </div>
            <div className="flex gap-2">
              <label className="flex-1 bg-black/40 border border-white/10 border-dashed rounded-lg px-3 py-3 text-sm text-white/50 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                <input type="file" className="hidden" onChange={handleSendFile} />
                {fileInput ? "File selected" : "Select small image to send..."}
              </label>
            </div>
          </div>

          {/* Context Sync */}
          <div className="glass-card p-4 flex items-center gap-3 border-l-4 border-l-ai-cyan bg-dark-800/40">
            <MonitorSmartphone className="w-5 h-5 text-ai-cyan" />
            <p className="text-sm font-medium text-white/90 flex-1">Context & AI Plan live-sync active</p>
            <CheckCircle className="w-4 h-4 text-accent-success" />
          </div>
        </div>
      </motion.div>
      
      <motion.p variants={slideUp} className="text-[10px] text-white/20 text-center mt-8 uppercase font-bold tracking-widest">
        Nexora Device Synchronization Prototype
      </motion.p>
    </motion.div>
  );
}
