import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-hero-gradient text-white">
      {/* Sidebar - Fixed positioning with proper z-index */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area - Properly spaced from sidebar */}
      <div className={`${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} flex flex-col min-h-screen transition-all duration-200 ease-out`}>
        {/* Navbar - Inside main content, not overlapping sidebar */}
        <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        
        {/* Page Content */}
        <main className="flex-1 pt-16 page-wrapper">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
