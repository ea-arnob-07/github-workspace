import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUser, getUserRepos, getUserFollowers, getUserFollowing } from '../services/githubApi';
import { formatNumber, formatDate } from '../utils/helpers';
import Tabs from '../components/common/Tabs';
import RepoCard from '../components/repositories/RepoCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './UserDetails.css';

/**
 * UserDetails Page — Shows user profile, repositories, followers, and following.
 * Route: /users/:username
 */
export default function UserDetails() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState('repos');
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile
  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await getUser(username);
      setUser(userData);
      // Also fetch repos by default
      const repoData = await getUserRepos(username, 1, 30);
      setRepos(repoData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchUser();
    // Reset tab when username changes
    setActiveTab('repos');
    setFollowers([]);
    setFollowing([]);
  }, [fetchUser]);

  // Fetch tab data on demand
  const handleTabChange = async (tabId) => {
    setActiveTab(tabId);

    if (tabId === 'followers' && followers.length === 0) {
      setTabLoading(true);
      try {
        const data = await getUserFollowers(username, 1, 30);
        setFollowers(data);
      } catch { /* ignore */ }
      finally { setTabLoading(false); }
    }

    if (tabId === 'following' && following.length === 0) {
      setTabLoading(true);
      try {
        const data = await getUserFollowing(username, 1, 30);
        setFollowing(data);
      } catch { /* ignore */ }
      finally { setTabLoading(false); }
    }
  };

  if (loading) return <div className="page-container"><LoadingSpinner text="Loading profile..." /></div>;
  if (error) return <div className="page-container"><ErrorMessage message={error} onRetry={fetchUser} /></div>;
  if (!user) return null;

  const tabs = [
    { id: 'repos', label: 'Repositories', icon: '📦', count: user.public_repos },
    { id: 'followers', label: 'Followers', icon: '👥', count: user.followers },
    { id: 'following', label: 'Following', icon: '👤', count: user.following },
  ];

  return (
    <div className="page-container">
      {/* Profile Header */}
      <div className="user-profile glass-card animate-fade-in-up">
        <div className="profile-main">
          <img src={user.avatar_url} alt={user.login} className="profile-avatar" />
          <div className="profile-info">
            <h1 className="profile-name">{user.name || user.login}</h1>
            <span className="profile-username">@{user.login}</span>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
            <div className="profile-meta">
              {user.company && <span>🏢 {user.company}</span>}
              {user.location && <span>📍 {user.location}</span>}
              {user.blog && (
                <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer">
                  🔗 {user.blog}
                </a>
              )}
              {user.created_at && <span>📅 Joined {formatDate(user.created_at)}</span>}
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{formatNumber(user.public_repos)}</span>
            <span className="stat-label">Repos</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{formatNumber(user.followers)}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{formatNumber(user.following)}</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{formatNumber(user.public_gists)}</span>
            <span className="stat-label">Gists</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

      {/* Tab Content */}
      <div className="user-tab-content">
        {tabLoading && <LoadingSpinner text="Loading..." size="sm" />}

        {!tabLoading && activeTab === 'repos' && (
          <div className="grid stagger-children">
            {repos.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-state-icon">📦</div>
                <h3>No repositories</h3>
              </div>
            ) : (
              repos.map((repo) => <RepoCard key={repo.id} repo={repo} />)
            )}
          </div>
        )}

        {!tabLoading && activeTab === 'followers' && (
          <div className="grid grid-3 stagger-children">
            {followers.length === 0 ? (
              <div className="empty-state card" style={{ gridColumn: '1 / -1' }}>
                <div className="empty-state-icon">👥</div>
                <h3>No followers</h3>
              </div>
            ) : (
              followers.map((f) => (
                <Link key={f.id} to={`/users/${f.login}`} className="follower-card glass-card">
                  <img src={f.avatar_url} alt={f.login} className="follower-avatar" />
                  <span className="follower-name">@{f.login}</span>
                </Link>
              ))
            )}
          </div>
        )}

        {!tabLoading && activeTab === 'following' && (
          <div className="grid grid-3 stagger-children">
            {following.length === 0 ? (
              <div className="empty-state card" style={{ gridColumn: '1 / -1' }}>
                <div className="empty-state-icon">👤</div>
                <h3>Not following anyone</h3>
              </div>
            ) : (
              following.map((f) => (
                <Link key={f.id} to={`/users/${f.login}`} className="follower-card glass-card">
                  <img src={f.avatar_url} alt={f.login} className="follower-avatar" />
                  <span className="follower-name">@{f.login}</span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
