import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import './Navbar.css';

/**
 * Navbar — Floating top center pill navigation.
 */
export default function Navbar({ onToggleSidebar, notificationCount = 0 }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useSettings();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cycle through themes
  const cycleTheme = () => {
    const themes = ['dark', 'light', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const themeIcon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '💻';

  return (
    <nav className="floating-navbar">
      <div className="navbar-pill">
        
        {/* Mobile menu toggle */}
        <button className="btn-ghost btn-icon mobile-only" onClick={onToggleSidebar}>
          ☰
        </button>

        <div className="navbar-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-text">GitHub Workspace</span>
        </div>
        
        <div className="navbar-divider" />

        <div className="navbar-time hidden-mobile">
          {time}
        </div>

        <div className="navbar-divider hidden-mobile" />

        <div className="navbar-actions">
          <button
            className="btn-ghost btn-icon action-btn"
            onClick={cycleTheme}
            title={`Theme: ${theme}`}
          >
            {themeIcon}
          </button>

          <Link to="/notifications" className="btn-ghost btn-icon action-btn notification-btn">
            🔔
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount > 9 ? '9+' : notificationCount}</span>
            )}
          </Link>
        </div>

        <div className="navbar-divider" />

        {/* User menu */}
        <div className="user-menu-container" ref={userMenuRef}>
          <button
            className="user-profile-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="avatar-circle">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="username-text hidden-mobile">{user?.username}</span>
            <span className="caret hidden-mobile">▾</span>
          </button>

          {showUserMenu && (
            <div className="user-dropdown glass-card animate-fade-in">
              <div className="dropdown-header">
                <strong>{user?.username}</strong>
                <span className="text-xs text-tertiary">{user?.email}</span>
              </div>
              <div className="dropdown-divider" />
              <Link to="/settings" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                ⚙️ Settings
              </Link>
              <button
                className="dropdown-item text-danger"
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                  navigate('/login');
                }}
              >
                🚪 Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
