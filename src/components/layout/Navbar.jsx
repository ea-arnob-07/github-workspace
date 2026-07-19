import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { Moon, Sun, Monitor, Bell, Menu, Terminal, ChevronDown } from 'lucide-react';
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

  const getTimeParts = () => {
    const now = new Date();
    const h24 = now.getHours();
    const h12 = h24 % 12 || 12;
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const period = h24 >= 12 ? 'PM' : 'AM';
    return { hours: String(h12).padStart(2, '0'), minutes, period };
  };

  const [timeParts, setTimeParts] = useState(getTimeParts());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeParts(getTimeParts());
    }, 1000);
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

  const themeIcon = theme === 'dark' ? <Moon size={14} /> : theme === 'light' ? <Sun size={14} /> : <Monitor size={14} />;

  return (
    <nav className="floating-navbar">
      <div className="navbar-pill">
        
        {/* Mobile menu toggle */}
        <button className="btn-ghost btn-icon mobile-only" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>

        <div className="navbar-brand">
          <span className="brand-icon"><Terminal size={14} /></span>
          <span className="brand-text">GitHub Workspace</span>
        </div>
        
        <div className="navbar-divider" />

        <div className="navbar-time-badge hidden-mobile">
          <span className="live-dot" title="Live"></span>
          <span className="clock-display">
            <span className="clock-hm">{timeParts.hours}<span className="clock-colon">:</span>{timeParts.minutes}</span>
            <span className="clock-period">{timeParts.period}</span>
          </span>
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
            <Bell size={14} />
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
            {user?.avatar && user.isGithub ? (
              <img src={user.avatar} alt="Avatar" className="avatar-circle" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div className="avatar-circle">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <span className="username-text hidden-mobile">{user?.username}</span>
            <span className="caret hidden-mobile"><ChevronDown size={14} /></span>
          </button>

          {showUserMenu && (
            <div className="user-dropdown glass-card animate-fade-in">
              <div className="dropdown-header">
                <strong>{user?.username}</strong>
                <span className="text-xs text-tertiary">{user?.email}</span>
              </div>
              <div className="dropdown-divider" />
              <Link to="/settings" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                 Settings
              </Link>
              <button
                className="dropdown-item text-danger"
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                  navigate('/login');
                }}
              >
                 Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
