import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { EventContextBar } from './EventContextBar';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#202124] flex flex-col font-sans">
      <Header />
      <EventContextBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-5 bg-[#202124]">
          <div className="w-full max-w-none">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
