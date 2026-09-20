import React from 'react';
import StatusBar from './StatusBar';
import BottomNav from './BottomNav';

const AppShell = ({ children }) => {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen relative bg-dark-950 sm:border-x sm:border-white/[0.06] sm:shadow-2xl flex flex-col overflow-hidden">
      <StatusBar />
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-11 pb-24 scroll-smooth">
        {children}
      </div>
      <BottomNav />
    </div>
  );
};

export default AppShell;
