import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-hero-gradient text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 page-wrapper">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
