import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Sidebar from '../components/laptop/Sidebar';
import TopNav from '../components/laptop/TopNav';
import DashboardOverview from '../components/laptop/DashboardOverview';
import AcademicContextPanel from '../components/laptop/AcademicContextPanel';
import AIStudyPlan from '../components/laptop/AIStudyPlan';
import ProjectWorkspace from '../components/laptop/ProjectWorkspace';
import ConnectedDevicesPanel from '../components/laptop/ConnectedDevicesPanel';

export default function LaptopDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Socket State
  const [socket, setSocket] = useState(null);
  const [code, setCode] = useState('');
  const [connected, setConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState('DISCONNECTED');
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Incoming Data State
  const [liveContext, setLiveContext] = useState(null);
  const [liveRecs, setLiveRecs] = useState([]);
  const [clipboard, setClipboard] = useState(null);
  const [file, setFile] = useState(null);
  const [projectUpdate, setProjectUpdate] = useState(null);

  // Dashboard Data State
  const [studentData, setStudentData] = useState(null);
  
  // Fetch initial data
  const fetchStudentData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`}/api/student/stu_1`);
      if (res.ok) {
        const data = await res.json();
        setStudentData(data);
      }
    } catch (err) {
      console.error("Failed to fetch student data", err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`}/api/recommendations/stu_1`);
      if (res.ok) {
        const data = await res.json();
        setLiveRecs(data.recommendations || []);
      }
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
    }
  };

  useEffect(() => {
    fetchStudentData();
    fetchRecommendations();
  }, []);

  // Socket Connection
  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`}`, {
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
    
    newSocket.on('DEVICE_DISCONNECTED', () => {
      setConnected(false);
    });

    newSocket.on('CONTEXT_UPDATED', (payload) => {
      setLiveContext(payload);
      setLastSyncTime(new Date());
    });

    newSocket.on('CONTEXT_REFRESH_NEEDED', () => {
      fetchStudentData();
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
      fetchStudentData();
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

  // Action Handler (Mark Complete / Uncomplete)
  const handleCompleteTask = async (type, id, actionType = 'complete') => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`}/api/action/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, studentId: 'stu_1', pairingCode: code.trim().toUpperCase(), actionType })
      });
      if (res.ok) {
        fetchStudentData();
        const data = await res.json();
        if (data.recommendations) {
          setLiveRecs(data.recommendations);
        }
      }
    } catch (err) {
      console.error("Failed to complete task:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav syncStatus={connected ? 'PAIRED' : syncStatus === 'CONNECTED' ? 'WAITING FOR PHONE' : syncStatus} />
        
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              studentData={studentData} 
              recommendations={liveRecs} 
              onComplete={handleCompleteTask} 
            />
          )}
          {activeTab === 'context' && (
            <AcademicContextPanel 
              studentData={studentData} 
              onComplete={handleCompleteTask} 
            />
          )}
          {activeTab === 'plan' && (
            <AIStudyPlan 
              recommendations={liveRecs} 
            />
          )}
          {activeTab === 'projects' && (
            <ProjectWorkspace 
              studentData={studentData} 
              onComplete={handleCompleteTask} 
            />
          )}
          {activeTab === 'devices' && (
            <ConnectedDevicesPanel 
              connected={connected}
              code={code}
              setCode={setCode}
              handlePair={handlePair}
              clipboard={clipboard}
              file={file}
              liveContext={liveContext}
              lastSyncTime={lastSyncTime}
            />
          )}
        </main>
      </div>
    </div>
  );
}
