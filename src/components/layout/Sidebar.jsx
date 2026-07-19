import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, Search, Star, Folder, Bell, Settings, GitBranch } from 'lucide-react';
import './Sidebar.css';

/**
 * Navigation items configuration.
 */
const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/search', label: 'Search', icon: <Search size={20} /> },
  { path: '/favorites', label: 'Favorites', icon: <Star size={20} /> },
  { path: '/collections', label: 'Collections', icon: <Folder size={20} /> },
  { path: '/notifications', label: 'Notifications', icon: <Bell size={20} /> },
  { path: '/my-profile', label: 'My Profile', icon: <User size={20} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
];

/**
 * Sidebar — Floating vertical pill navigation.
 */
export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`floating-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <nav className="sidebar-nav-pill">

          {/* Top branding logo */}
          <div className="sidebar-brand-top">
            <div className="sidebar-brand-icon">
              <GitBranch size={20} />
            </div>
            <div className="sidebar-brand-info">
              <span className="sidebar-brand-name">GitHub Workspace</span>
              <span className="sidebar-brand-tagline">Developer Hub</span>
            </div>
          </div>

          <div className="sidebar-nav-separator" />

          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `pill-nav-link ${isActive ? 'pill-nav-active' : ''}`
              }
              onClick={onClose}
              title={item.label}
            >
              <span className="pill-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}

          <div className="sidebar-spacer" />

          <div className="sidebar-credit">
            <div className="credit-line">
              <span className="credit-dot"></span>
              <span className="credit-version">v1.0.0</span>
            </div>
            <div className="credit-author">Estiuk Arafat Arnob</div>
          </div>
        </nav>
      </aside>
    </>
  );
}
