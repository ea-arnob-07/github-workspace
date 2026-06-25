import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

/**
 * Layout — Main app layout with Navbar, Sidebar, and content area.
 * Uses Outlet from React Router to render nested route content.
 */
export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="app-layout">
      <Navbar
        onToggleSidebar={handleToggleSidebar}
        notificationCount={0} // Will be wired to NotificationContext in Phase 5
      />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
