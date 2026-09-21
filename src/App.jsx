import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import AppShell from './components/layout/AppShell';
import HomeScreen from './screens/HomeScreen';
import CaptureScreen from './screens/CaptureScreen';
import AcademicsScreen from './screens/AcademicsScreen';
import AIPlanScreen from './screens/AIPlanScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import ConnectedWorkspaceScreen from './screens/ConnectedWorkspaceScreen';
import ProfileScreen from './screens/ProfileScreen';
import SubjectDetail from './components/academics/SubjectDetail';

import LaptopDashboard from './screens/LaptopDashboard';

import { AppProvider, useApp } from './context/AppContext';

function InnerApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setActiveTab } = useApp();

  // Keep bottom nav active tab in sync with the route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('home');
    else if (path === '/capture') setActiveTab('capture');
    else if (path === '/academics') setActiveTab('academics');
    else if (path === '/ai-plan') setActiveTab('ai-plan');
    else if (path === '/projects') setActiveTab('projects');
    else if (path === '/profile') setActiveTab('profile');
  }, [location.pathname, setActiveTab]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Laptop Route */}
        <Route path="/laptop" element={<LaptopDashboard />} />
        
        {/* Mobile App Routes wrapped in AppShell */}
        <Route path="/" element={<AppShell><HomeScreen /></AppShell>} />
        <Route path="/capture" element={<AppShell><CaptureScreen /></AppShell>} />
        <Route path="/academics" element={<AppShell><AcademicsScreen /></AppShell>} />
        <Route path="/ai-plan" element={<AppShell><AIPlanScreen /></AppShell>} />
        <Route path="/projects" element={<AppShell><ProjectsScreen /></AppShell>} />
        <Route path="/workspace" element={<AppShell><ConnectedWorkspaceScreen /></AppShell>} />
        <Route path="/profile" element={<AppShell><ProfileScreen /></AppShell>} />
        
        <Route path="/subject/:id" element={<AppShell><SubjectDetail /></AppShell>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return <InnerApp />;
}
