import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { student as initialStudent } from '../data/student';
import { subjects as initialSubjects } from '../data/subjects';
import { captures as initialCaptures } from '../data/captures';
import { recommendations as initialRecommendations } from '../data/recommendations';
import { schedule as initialSchedule } from '../data/schedule';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [student, setStudent] = useState(initialStudent);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [projects, setProjects] = useState([]);
  const [captures, setCaptures] = useState(initialCaptures);
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [schedule] = useState(initialSchedule); 
  
  const [activeTab, setActiveTab] = useState('home');
  const [captureFlow, setCaptureFlow] = useState({ step: 'idle', captureData: null });
  const [telegramFlow, setTelegramFlow] = useState({ step: 'idle', telegramData: null });

  // Sync State
  const [socket, setSocket] = useState(null);
  const [syncStatus, setSyncStatus] = useState('DISCONNECTED'); // CONNECTED, CONNECTING, DISCONNECTED
  const [pairingCode, setPairingCode] = useState(null);
  const [laptopConnected, setLaptopConnected] = useState(false);
  const [sharedClipboard, setSharedClipboard] = useState(null);
  const [receivedFile, setReceivedFile] = useState(null);

  useEffect(() => {
    // Initialize Socket
    const newSocket = io(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`}`, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setSyncStatus('CONNECTED');
    });

    newSocket.on('disconnect', () => {
      setSyncStatus('DISCONNECTED');
      setLaptopConnected(false);
    });

    newSocket.on('connect_error', () => {
      setSyncStatus('CONNECTING');
    });

    newSocket.on('PAIRING_CODE_GENERATED', (code) => {
      setPairingCode(code);
    });

    newSocket.on('DEVICE_CONNECTED', () => {
      setLaptopConnected(true);
    });

    newSocket.on('DEVICE_DISCONNECTED', () => {
      setLaptopConnected(false);
    });

    newSocket.on('CLIPBOARD_SYNC', (text) => {
      setSharedClipboard(text);
    });

    newSocket.on('FILE_TRANSFER', (file) => {
      setReceivedFile(file);
    });

    return () => newSocket.close();
  }, []);

  const requestPairingCode = () => {
    if (socket) socket.emit('REQUEST_PAIRING_CODE');
  };

  const joinPairingCode = (code) => {
    if (socket) {
      setPairingCode(code);
      socket.emit('JOIN_PAIRING_CODE', code);
    }
  };

  const disconnectWorkspace = () => {
    if (socket && pairingCode) {
      socket.emit('LEAVE_PAIRING_CODE', pairingCode);
      setPairingCode(null);
      setLaptopConnected(false);
    }
  };

  const sendClipboard = (text) => {
    if (socket && pairingCode) {
      socket.emit('CLIPBOARD_SYNC', { code: pairingCode, text });
    }
  };

  const sendFile = (fileData, fileName) => {
    if (socket && pairingCode) {
      socket.emit('FILE_TRANSFER', { code: pairingCode, fileData, fileName });
    }
  };
  
  // Phase 1/4: Real Academic Database Hydration & Recommendation Engine
  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`}/api/recommendations/stu_1`);
      if (response.ok) {
        const data = await response.json();
        const recs = data.recommendations.map(r => ({
          id: r.id,
          type: r.type,
          priority: r.priority,
          title: r.title,
          description: r.reasons.join(' • '),
          reasons: r.reasons,
          subject: r.subject,
          estimatedTime: `${r.durationMinutes} min`,
          actionLabel: r.type === 'assignment' ? 'Open Assignment' : 'Start Review',
        }));
        setRecommendations(recs);
      }
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    }
  };

  useEffect(() => {
    const fetchRealAcademicContext = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`}/api/student/stu_1`);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        
        setStudent(prev => ({
          ...prev,
          name: data.student.name,
          firstName: data.student.firstName,
          program: data.student.program,
          semester: data.student.semester,
          gpa: data.student.gpa
        }));

        const hydratedSubjects = data.subjects.map(dbSub => ({
          id: dbSub.id,
          name: dbSub.name,
          code: dbSub.code,
          color: dbSub.color,
          professor: dbSub.professor,
          progress: dbSub.progress,
          icon: dbSub.name.includes('Operating') ? 'cpu' : 
                dbSub.name.includes('Database') ? 'database' : 
                dbSub.name.includes('SOA') ? 'network' : 'book-open',
          topics: (dbSub.topics || []).map(t => ({
            name: t.name,
            status: t.status,
            module: t.module_name
          })),
          upcomingItems: (dbSub.upcomingItems || []).map(u => ({
            type: u.type,
            title: u.title,
            date: u.date,
            priority: u.priority
          }))
        }));

        setSubjects(hydratedSubjects);
        if (data.projects) {
          setProjects(data.projects);
        }

        // Fetch real recommendations
        await fetchRecommendations();
      } catch (err) {
        console.warn("Failed to fetch real context, using mock data.", err);
      }
    };

    fetchRealAcademicContext();
  }, []);

  const addCapture = (newCapture) => {
    setCaptures(prev => [newCapture, ...prev]);
  };

  const startCaptureFlow = () => {
    setCaptureFlow({ step: 'camera', captureData: null });
  };

  const advanceCaptureStep = (nextStep, data = null) => {
    setCaptureFlow(prev => ({
      step: nextStep,
      captureData: data ? { ...prev.captureData, ...data } : prev.captureData
    }));
  };

  const resetCaptureFlow = () => {
    setCaptureFlow({ step: 'idle', captureData: null });
  };

  const startTelegramFlow = () => {
    setTelegramFlow({ step: 'upload', telegramData: null });
  };

  const advanceTelegramStep = (nextStep, data = null) => {
    setTelegramFlow(prev => ({
      step: nextStep,
      telegramData: data ? { ...prev.telegramData, ...data } : prev.telegramData
    }));
  };

  const resetTelegramFlow = () => {
    setTelegramFlow({ step: 'idle', telegramData: null });
  };

  const confirmVerifiedContext = async (captureData) => {
    try {
      // Pass pairingCode so backend can broadcast updates
      const res = await fetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`}/api/context/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'stu_1', captureData, pairingCode })
      });
      if (res.ok) {
        const data = await res.json();
        const recs = data.recommendations.map(r => ({
          id: r.id,
          type: r.type,
          priority: r.priority,
          title: r.title,
          description: r.reasons.join(' • '),
          reasons: r.reasons,
          subject: r.subject,
          estimatedTime: `${r.durationMinutes} min`,
          actionLabel: r.type === 'assignment' ? 'Open Assignment' : 'Start Review',
        }));
        setRecommendations(recs);
      }
    } catch (err) {
      console.error("Context Accept API failed:", err);
    }

    setSubjects(prev => {
      return prev.map(sub => {
        if (sub.name === captureData.subject) {
          return {
            ...sub,
            topics: sub.topics.map(t => {
              if (t.name === captureData.topic || t.name === captureData.subtopic) {
                return { ...t, status: 'completed' };
              }
              return t;
            })
          };
        }
        return sub;
      });
    });

    const newCapture = {
      id: `cap-${Date.now()}`,
      type: 'camera',
      title: captureData?.extractedText?.[0] || 'Unknown Topic',
      subject: captureData.subject || 'Unknown',
      topic: captureData.subtopic || captureData.topic || 'Unknown',
      timestamp: new Date().toISOString(),
      aiConfidence: captureData.confidence || 0.94,
      status: 'verified',
      tags: ['capture']
    };
    addCapture(newCapture);
  };

  return (
    <AppContext.Provider value={{
      student, subjects, setSubjects, projects, setProjects, captures, addCapture,
      recommendations, setRecommendations, schedule,
      activeTab, setActiveTab,
      captureFlow, startCaptureFlow, advanceCaptureStep, resetCaptureFlow, confirmVerifiedContext,
      telegramFlow, startTelegramFlow, advanceTelegramStep, resetTelegramFlow,
      // Socket & Sync state
      syncStatus, pairingCode, laptopConnected, requestPairingCode, joinPairingCode,
      disconnectWorkspace,
      sharedClipboard, sendClipboard, receivedFile, sendFile, socket
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
