import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone, CheckCircle, File, Copy, Brain, Loader2, RotateCcw, Activity } from 'lucide-react';
import { staggerContainer, slideUp } from '../utils/animations';

export default function LaptopDashboard() {
  const [socket, setSocket] = useState(null);
  const [code, setCode] = useState('');
  const [connected, setConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState('DISCONNECTED');

  const [liveContext, setLiveContext] = useState(null);
  const [liveRecs, setLiveRecs] = useState([]);
  const [clipboard, setClipboard] = useState(null);
  const [file, setFile] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const [projectUpdate, setProjectUpdate] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    setSocket(newSocket);

    newSocket.on('connect', () => setSyncStatus('CONNECTED'));
    newSocket.on('disconnect', () => {
      setSyncStatus('DISCONNECTED');
      setConnected(false);
    });
    newSocket.on('connect_error', () => setSyncStatus('CONNECTING'));

    newSocket.on('DEVICE_CONNECTED', () => {
      setConnected(true);
    });

    newSocket.on('CONTEXT_UPDATED', (payload) => {
      setLiveContext(payload);
      setLastSyncTime(new Date());
    });

    newSocket.on('RECOMMENDATIONS_UPDATED', (recs) => {
      setLiveRecs(recs);
      setLastSyncTime(new Date());
    });

    newSocket.on('CLIPBOARD_SYNC', (text) => {
      setClipboard(text);
      setLastSyncTime(new Date());
    });

    newSocket.on('FILE_TRANSFER', (payload) => {
      setFile(payload);
      setLastSyncTime(new Date());
    });

    newSocket.on('PROJECT_UPDATED', (payload) => {
      setProjectUpdate(payload);
      setLastSyncTime(new Date());
      setTimeout(() => setProjectUpdate(null), 8000);
    });

    return () => newSocket.close();
  }, []);

  const handlePair = (e) => {
    e.preventDefault();
    if (socket && code.trim()) {
      socket.emit('JOIN_PAIRING_CODE', code.trim().toUpperCase());
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to system clipboard!');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const [isResetting, setIsResetting] = useState(false);

  const handleDemoReset = async () => {
    if (window.confirm("Are you sure you want to reset the demo? This will clear active sessions and reset the database to the initial seed state.")) {
      setIsResetting(true);
      try {
        const res = await fetch('http://localhost:8000/api/demo/reset', { method: 'POST' });
        if (res.ok) {
          alert("Demo reset successfully. Please refresh mobile app and regenerate pairing code.");
          window.location.reload();
        }
      } catch (err) {
        alert("Failed to reset demo.");
        setIsResetting(false);
      }
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-8 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-cyan to-ai-blue flex items-center justify-center">
            <Monitor className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ContextAI <span className="text-white/50">Laptop Workspace</span></h1>
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={handleDemoReset} disabled={isResetting} className={`flex items-center gap-2 text-xs font-bold transition-colors uppercase tracking-widest ${isResetting ? 'text-white' : 'text-white/40 hover:text-white'}`}>
            {isResetting ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
            {isResetting ? 'Resetting...' : 'Demo Reset'}
          </button>
          
          <div className="flex items-center gap-2">
            {syncStatus === 'CONNECTING' && <Loader2 className="w-4 h-4 text-accent-warning animate-spin" />}
            <div className={`w-2 h-2 rounded-full ${syncStatus === 'CONNECTED' ? 'bg-accent-success' : 'bg-accent-warning'}`}></div>
            <span className="text-sm font-bold text-white/50 tracking-widest uppercase">{syncStatus}</span>
          </div>
        </div>
      </div>

      {/* Sync Status Bar */}
      {connected && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl mb-6 bg-ai-blue/10 border border-ai-blue/20 rounded-xl px-4 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-ai-blue">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Live <span className="text-white/30 px-2">•</span> Context Synced <span className="text-white/30 px-2">•</span> Recommendations Synced</span>
          </div>
          <div className="text-xs font-bold text-ai-blue/50 uppercase tracking-widest">
            {lastSyncTime ? `Last Sync: ${formatTime(lastSyncTime)}` : 'Awaiting data...'}
          </div>
        </motion.div>
      )}

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Connection Panel (Left) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-6 border border-white/5 bg-dark-800/50 relative overflow-hidden rounded-3xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-ai-blue/10 blur-3xl rounded-full"></div>
            
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6">Device Pairing</h2>
            
            {!connected ? (
              <form onSubmit={handlePair} className="space-y-4">
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
              <div className="flex flex-col items-center justify-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-ai-blue/20 flex items-center justify-center text-ai-blue shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">ContextAI Mobile</p>
                  <p className="text-accent-success font-medium flex items-center justify-center gap-2 mt-1">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-success"></span>
                    </span>
                    Connected
                  </p>
                </div>
              </div>
            )}
          </div>

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
                        <p className="text-sm text-white/90 break-words">{clipboard}</p>
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

          {projectUpdate && (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-6 border border-white/5 bg-ai-blue/10 rounded-3xl mt-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-ai-blue/20 blur-3xl rounded-full"></div>
                <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Project Updated</h2>
                <div className="space-y-2">
                  <p className="font-semibold text-white">{projectUpdate.name}</p>
                  <div className="flex justify-between text-xs text-white/70">
                    <span>Progress: {projectUpdate.progress}%</span>
                    <span>{projectUpdate.completedCount}/{projectUpdate.totalCount} Tasks</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div 
                      className="bg-blue-400 h-1.5 rounded-full transition-all duration-1000"
                      style={{ width: `${projectUpdate.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-emerald-400 mt-2">
                    ✓ Task updated: {projectUpdate.recentTask}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Live Context & Recommendations (Right) */}
        <div className="md:col-span-8 flex flex-col gap-6">
          
          {/* Live Context */}
          <div className="glass-card p-8 border border-white/5 bg-dark-800/50 rounded-3xl min-h-[250px] relative">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6">Live Academic Context</h2>
            
            {!connected ? (
              <div className="absolute inset-0 flex items-center justify-center text-white/20">
                <p>Connect phone to view live context updates</p>
              </div>
            ) : !liveContext ? (
              <div className="absolute inset-0 flex items-center justify-center text-white/40">
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
                  <h3 className="text-3xl font-bold text-white mt-2 mb-4">New Topic: <br/><span className="text-white/80">{liveContext.topic}</span></h3>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <span className="bg-accent-success/20 text-accent-success px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-accent-success/20">
                      <CheckCircle className="w-4 h-4" /> Status: {liveContext.status}
                    </span>
                    {liveContext.confidence && (
                      <span className="bg-white/10 text-white/80 px-4 py-2 rounded-xl text-sm font-bold border border-white/10">
                        Verification Confidence: {liveContext.confidence}%
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Live Recommendations */}
          <div className="glass-card p-8 border border-white/5 bg-dark-800/50 rounded-3xl min-h-[300px] relative">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-5 h-5 text-ai-purple" />
              <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">Live AI Recommendation</h2>
            </div>
            
            {!connected ? (
              <div className="absolute inset-0 flex items-center justify-center text-white/20">
                <p>Connect phone to sync recommendations</p>
              </div>
            ) : liveRecs.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-white/40">
                <p>Waiting for context updates...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {liveRecs.slice(0, 2).map((rec, i) => (
                  <motion.div 
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-black/30 border ${i === 0 ? 'border-ai-purple/50' : 'border-white/10'} rounded-2xl p-6`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{rec.title}</h3>
                        <p className="text-white/50 text-sm mt-1">{rec.subject}</p>
                      </div>
                      <div className="bg-ai-purple/20 text-ai-purple px-4 py-2 rounded-xl text-sm font-bold">
                        {rec.durationMinutes} min
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Why:</p>
                      <ul className="space-y-2">
                        {rec.reasons?.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-ai-purple mt-1.5 shrink-0"></div>
                            <span className="text-sm text-white/80">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
