import { NavLink } from 'react-router-dom';
import './Sidebar.css';

/**
 * Navigation items configuration.
 */
const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/my-profile', label: 'My Profile', icon: '👤' },
  { path: '/search', label: 'Search', icon: '🔍' },
  { path: '/favorites', label: 'Favorites', icon: '⭐' },
  { path: '/collections', label: 'Collections', icon: '📁' },
  { path: '/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
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
          <div className="sidebar-credit">
            Developed by ARNOB
          </div>
        </nav>
      </aside>
    </>
  );
}
