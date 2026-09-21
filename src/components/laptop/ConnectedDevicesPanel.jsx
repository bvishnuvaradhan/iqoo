import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Activity, Copy, File, CheckCircle } from 'lucide-react';
import { slideUp, staggerContainer } from '../../utils/animations';

export default function ConnectedDevicesPanel({ 
  connected, 
  code, 
  setCode, 
  handlePair, 
  clipboard, 
  file, 
  liveContext,
  lastSyncTime
}) {
  
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to system clipboard!');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="p-8 max-w-5xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Connected Devices & Sync</h1>
        <p className="text-white/50 text-sm">Real-time event stream from your mobile captures.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Connection Panel */}
        <div className="space-y-6">
          <motion.div variants={slideUp} className="glass-card p-6 border border-white/5 bg-dark-800/50 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-ai-blue/10 blur-3xl rounded-full"></div>
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6">Device Pairing</h2>
            
            {!connected ? (
              <form onSubmit={handlePair} className="space-y-4 relative z-10">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-2">Enter Pairing Code</label>
                  <input 
                    type="text" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CONTEXT-XXXX"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white focus:outline-none focus:border-ai-cyan transition-colors uppercase"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-ai-cyan hover:bg-ai-cyan/90 text-black font-bold py-3 rounded-xl transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  Connect Phone
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 space-y-4 relative z-10">
                <div className="w-16 h-16 rounded-full bg-ai-blue/20 flex items-center justify-center text-ai-blue shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">Nexora Mobile</p>
                  <p className="text-accent-success font-medium flex items-center justify-center gap-2 mt-1">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-success"></span>
                    </span>
                    Connected
                  </p>
                </div>
                <div className="w-full text-center mt-4 pt-4 border-t border-white/5">
                   <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Last Sync: {lastSyncTime ? formatTime(lastSyncTime) : 'Never'}</p>
                   <button 
                     onClick={() => window.location.reload()}
                     className="text-xs font-bold text-accent-error/80 uppercase tracking-widest px-4 py-2 rounded-full border border-accent-error/30 hover:bg-accent-error/10 transition-colors"
                   >
                     Disconnect
                   </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Incoming File/Clipboard Panel */}
          {connected && (
            <AnimatePresence>
              {(clipboard || file) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 border border-white/5 bg-dark-800/50 rounded-3xl"
                >
                  <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6">Received Data</h2>
                  <div className="space-y-4">
                    {clipboard && (
                      <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-ai-blue">
                            <Copy className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Clipboard</span>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(clipboard)}
                            className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="text-sm text-white/90 break-words max-h-32 overflow-y-auto custom-scrollbar">{clipboard}</p>
                      </div>
                    )}

                    {file && (
                      <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-ai-purple mb-3">
                          <File className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-widest">File Transferred</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {file.fileData.startsWith('data:image') ? (
                            <img src={file.fileData} alt={file.fileName} className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                          ) : (
                            <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                              <File className="w-6 h-6 text-white/40" />
                            </div>
                          )}
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{file.fileName}</p>
                            <p className="text-xs text-accent-success flex items-center gap-1 mt-1">
                              <CheckCircle className="w-3 h-3" /> Status: Transferred
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Live Context Timeline */}
        <div className="space-y-6">
          <motion.div variants={slideUp} className="glass-card p-6 border border-white/5 bg-dark-800/50 rounded-3xl min-h-[400px]">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Live Event Timeline
            </h2>

            {!connected ? (
              <div className="flex h-64 items-center justify-center text-white/20">
                <p>Connect phone to view live context updates</p>
              </div>
            ) : !liveContext ? (
              <div className="flex h-64 items-center justify-center text-white/40">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-t-ai-cyan border-r-transparent border-b-ai-cyan border-l-transparent rounded-full animate-spin"></div>
                  <p>Listening for mobile captures...</p>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black/30 border border-ai-cyan/30 rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-ai-cyan/10 blur-3xl rounded-full"></div>
                <div className="relative z-10 flex flex-col gap-1">
                  <p className="text-ai-cyan font-bold text-sm tracking-widest uppercase">{liveContext.subject}</p>
                  <h3 className="text-xl font-bold text-white mt-2 mb-4">Topic Updated: <br/><span className="text-white/80 text-sm">{liveContext.topic}</span></h3>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <span className="bg-accent-success/20 text-accent-success px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-accent-success/20">
                      <CheckCircle className="w-4 h-4" /> {liveContext.status}
                    </span>
                    {liveContext.confidence && (
                      <span className="bg-white/10 text-white/80 px-4 py-2 rounded-xl text-sm font-bold border border-white/10">
                        Confidence: {liveContext.confidence}%
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
