import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

/**
 * Dashboard — Landing page after login.
 * Shows welcome message, quick stats, and navigation shortcuts.
 * Activity feed and favorites will be wired in later phases.
 */
export default function Dashboard() {
  const { user } = useAuth();

  // Quick action cards
  const quickActions = useMemo(
    () => [
      {
        icon: '🔍',
        title: 'Search Users',
        description: 'Find GitHub developers by username',
        link: '/search?type=users',
        color: 'var(--color-accent)',
      },
      {
        icon: '📦',
        title: 'Explore Repos',
        description: 'Search and discover repositories',
        link: '/search?type=repositories',
        color: 'var(--color-success)',
      },
      {
        icon: '⭐',
        title: 'Favorites',
        description: 'View your starred repos & users',
        link: '/favorites',
        color: 'var(--color-warning)',
      },
      {
        icon: '📁',
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
            Welcome back, <span className="welcome-name">{user?.username || 'Developer'}</span> 👋
          </h1>
          <p>Explore GitHub users, repositories, and manage your workspace.</p>
        </div>
        <div className="welcome-decoration">
          <div className="welcome-orb welcome-orb-1" />
          <div className="welcome-orb welcome-orb-2" />
        </div>
      </div>

      {/* Quick Actions (Masonry layout) */}
      <section className="dashboard-section">
        <div className="masonry-header">
          <h2 className="section-title">Quick Actions</h2>
          <div className="search-bar-small">
            <span className="search-icon">🔍</span>
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
                <span className="btn-ghost">View Details →</span>
              </div>
            </Link>
          ))}
          {/* Add a few filler cards to simulate the dense grid in the screenshot */}
           <Link to="/settings" className="action-card glass-card">
              <div className="card-header-badge text-warning">Urgent</div>
              <span className="action-icon" style={{ background: 'var(--color-warning-muted)' }}>⚙️</span>
              <h3>System Settings</h3>
              <p>Review your account preferences</p>
              <div className="action-footer">
                <span className="btn-ghost">View Details →</span>
              </div>
            </Link>
            <Link to="/notifications" className="action-card glass-card">
              <div className="card-header-badge text-danger">Immediate</div>
              <span className="action-icon" style={{ background: 'var(--color-danger-muted)' }}>🔔</span>
              <h3>Notifications</h3>
              <p>You have unread alerts</p>
              <div className="action-footer">
                <span className="btn-ghost">View Details →</span>
              </div>
            </Link>
            <Link to="/users/ea-arnob-07" className="action-card glass-card personal-action-card">
              <div className="card-header-badge text-success">Personal</div>
              <span className="action-icon" style={{ background: 'var(--color-success-muted)' }}>👨‍💻</span>
              <div className="personal-repo-avatar">
                <img src="https://github.com/ea-arnob-07.png" alt="ea-arnob-07" />
              </div>
              <h3>ea-arnob-07</h3>
              <p>My Personal Repository</p>
              <div className="action-footer">
                <span className="btn-ghost">View Repository →</span>
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
              <div className="empty-state-icon">📋</div>
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
