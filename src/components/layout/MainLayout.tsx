import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { EventContextBar } from './EventContextBar';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col font-sans">
      <Header />
      <EventContextBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#0b0f19]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
