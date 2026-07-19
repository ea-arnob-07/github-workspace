import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Package, Star, Folder, Settings, Bell, User, ClipboardList, Sparkles } from 'lucide-react';
import './Dashboard.css';

/**
 * Dashboard — Landing page after login.
 * Shows welcome message, quick stats, and navigation shortcuts.
 * Activity feed and favorites will be wired in later phases.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Quick action cards
  const quickActions = useMemo(
    () => [
      {
        icon: <Search size={18} />,
        title: 'Search Users',
        description: 'Find GitHub developers by username',
        link: '/search?type=users',
        color: 'var(--color-accent)',
      },
      {
        icon: <Package size={18} />,
        title: 'Explore Repos',
        description: 'Search and discover repositories',
        link: '/search?type=repositories',
        color: 'var(--color-success)',
      },
      {
        icon: <Star size={18} />,
        title: 'Favorites',
        description: 'View your starred repos & users',
        link: '/favorites',
        color: 'var(--color-warning)',
      },
      {
        icon: <Folder size={18} />,
        title: 'Collections',
        description: 'Organize repos into collections',
        link: '/collections',
        color: 'var(--color-purple)',
      },
    ],
    []
  );

  // Example trending users to showcase
  const trendingUsers = [
    { username: 'torvalds', avatar: 'https://avatars.githubusercontent.com/u/1024025?v=4' },
    { username: 'gaearon', avatar: 'https://avatars.githubusercontent.com/u/810438?v=4' },
    { username: 'yyx990803', avatar: 'https://avatars.githubusercontent.com/u/499550?v=4' },
    { username: 'sindresorhus', avatar: 'https://avatars.githubusercontent.com/u/170270?v=4' },
    { username: 'tj', avatar: 'https://avatars.githubusercontent.com/u/25254?v=4' },
  ];

  return (
    <div className="page-container">
      {/* Welcome Section */}
      <div className="dashboard-welcome animate-fade-in-up">
        <div className="welcome-content">
          <h1>
            Hello, <span className="welcome-name">{user?.username || 'Developer'}</span>!
          </h1>
          <p>Welcome to GitHub Workspace! Discover developers, browse repositories, build custom collections, and work together on amazing projects.</p>
        </div>
        <div className="welcome-search-container">
          <form onSubmit={handleSearch} className="welcome-search-form">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search developers or repositories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary search-btn">Search</button>
          </form>
        </div>
      </div>

      {/* Quick Actions (Masonry layout) */}
      <section className="dashboard-section">
        <div className="masonry-header">
          <h2 className="section-title">Quick Actions</h2>
          <div className="search-bar-small">
            <span className="search-icon"><Search size={16} /></span>
            <input type="text" placeholder="Search..." />
          </div>
        </div>
        <div className="dashboard-masonry">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className="action-card glass-card"
            >
              <div className="card-header-badge">Available</div>
              <span
                className="action-icon"
                style={{ background: `${action.color}22` }}
              >
                {action.icon}
              </span>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
              <div className="action-footer">
                <span className="btn-ghost">View Details </span>
              </div>
            </Link>
          ))}
          {/* Add a few filler cards to simulate the dense grid in the screenshot */}
           <Link to="/settings" className="action-card glass-card">
              <div className="card-header-badge text-warning">Urgent</div>
              <span className="action-icon" style={{ background: 'var(--color-warning-muted)' }}><Settings size={18} /></span>
              <h3>System Settings</h3>
              <p>Review your account preferences</p>
              <div className="action-footer">
                <span className="btn-ghost">View Details </span>
              </div>
            </Link>
            <Link to="/notifications" className="action-card glass-card">
              <div className="card-header-badge text-danger">Immediate</div>
              <span className="action-icon" style={{ background: 'var(--color-danger-muted)' }}><Bell size={18} /></span>
              <h3>Notifications</h3>
              <p>You have unread alerts</p>
              <div className="action-footer">
                <span className="btn-ghost">View Details </span>
              </div>
            </Link>
            <Link to="/users/ea-arnob-07" className="action-card glass-card personal-action-card">
              <div className="card-header-badge text-success">Personal</div>
              <span className="action-icon" style={{ background: 'var(--color-success-muted)' }}><User size={18} /></span>
              <div className="personal-repo-avatar">
                <img src="https://github.com/ea-arnob-07.png" alt="ea-arnob-07" />
              </div>
              <h3>ea-arnob-07</h3>
              <p>My Personal Repository</p>
              <div className="action-footer">
                <span className="btn-ghost">View Repository </span>
              </div>
            </Link>
        </div>
      </section>

      {/* Wide layout area simulating the calendar from the screenshot */}
      <section className="dashboard-section wide-section">
        <h2 className="section-title">Availability / Recent Activity</h2>
        <div className="activity-board glass-card">
          <div className="board-sidebar">
             <h3>Popular Developers</h3>
             {trendingUsers.map(u => (
               <Link to={`/users/${u.username}`} className="developer-card" key={u.username}>
                  <img src={u.avatar} alt="avatar" className="trending-avatar" />
                  <span className="trending-name">@{u.username}</span>
               </Link>
             ))}
          </div>
          <div className="board-main">
            <div className="empty-state">
              <div className="empty-state-icon"><ClipboardList size={32} /></div>
              <h3>No recent activity</h3>
              <p>Start searching for users and repositories to see your activity here.</p>
              <Link to="/search" className="btn btn-primary mt-4">
                Start Exploring
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
