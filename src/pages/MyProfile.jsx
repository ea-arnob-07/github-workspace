import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserRepos } from '../services/githubApi';
import MyRepoCard from '../components/github/MyRepoCard';
import GitHubLoginButton from '../components/github/GitHubLoginButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './MyProfile.css';

export default function MyProfile() {
  const { isGithubAuth, githubUser, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [error, setError] = useState(null);
  
  // Pre-load logged-in user repos
  useEffect(() => {
    if (isGithubAuth && githubUser) {
      setSearchQuery(githubUser.login);
      handleSearch(githubUser.login);
    }
  }, [isGithubAuth, githubUser]);

  const handleSearch = async (username) => {
    const query = username || searchQuery;
    if (!query.trim()) return;
    
    setLoadingRepos(true);
    setError(null);
    setRepos([]);
    
    try {
      const data = await getUserRepos(query);
      setRepos(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch repositories. Check the username.');
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  if (isAuthLoading) {
    return <div className="page-container"><LoadingSpinner text="Loading..." /></div>;
  }

  return (
    <div className="page-container my-profile animate-fade-in">
      <div className="mb-4">
        <h1 className="m-0" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>GitHub Connect</h1>
      </div>

      {/* TOP MIDDLE: AUTH STATUS / LOGIN BUTTON */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginBottom: '40px' }}>
        {!isGithubAuth ? (
          <div style={{ width: '400px' }}>
            <GitHubLoginButton />
          </div>
        ) : (
          <div className="logged-in-badge glass-card px-4 py-2" style={{ borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <img src={githubUser.avatar_url} alt={githubUser.login} className="header-avatar" />
            <div className="text-start">
              <div className="fw-bold">{githubUser.login}</div>
              <div className="text-xs text-accent">Authenticated</div>
            </div>
          </div>
        )}
      </div>

      <div className="my-profile-grid" style={{ maxWidth: '1100px', margin: '0 auto', marginBottom: '40px' }}>
        {/* LEFT COLUMN: VIEW REPOSITORIES */}
        <div className="glass-card custom-card d-flex flex-column" style={{ padding: '40px', minHeight: '420px' }}>
          <h3 className="mb-4 d-flex align-items-center gap-3 card-title" style={{ fontSize: '1.4rem' }}>
            <span style={{ color: '#4facfe', fontSize: '1.5rem' }}>🔍</span> View Repository
          </h3>
          
          <form onSubmit={handleSearchSubmit} className="search-form mb-4 d-flex flex-column gap-3">
            <input
              type="text"
              className="form-control glass-input custom-input"
              placeholder="GitHub username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: '1.1rem', padding: '14px 20px' }}
            />
            <div style={{ marginTop: '16px' }}>
              <button 
                type="submit" 
                className="btn px-5 d-inline-flex align-items-center gap-2" 
                disabled={loadingRepos} 
                style={{ 
                  fontSize: '1.05rem', 
                  padding: '12px 28px',
                  borderRadius: '50px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.borderColor = 'rgba(79, 172, 254, 0.5)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Search
              </button>
            </div>
          </form>

          <div className="repo-results flex-1">
            {loadingRepos ? (
              <div className="py-4"><LoadingSpinner text="Fetching..." /></div>
            ) : error ? (
              <ErrorMessage message={error} className="mt-2" />
            ) : repos.length > 0 ? (
              <div className="repo-list">
                {repos.map(repo => (
                  <MyRepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* RIGHT COLUMN: CREATE REPOSITORY */}
        <div className="glass-card custom-card d-flex flex-column" style={{ padding: '40px', minHeight: '420px' }}>
          <h3 className="mb-4 d-flex align-items-center gap-3 card-title" style={{ fontSize: '1.4rem' }}>
            <span style={{ color: '#a18cd1', fontSize: '1.5rem' }}>➕</span> Create New Repository
          </h3>
          
          <div className="create-repo-content flex-1 d-flex flex-column justify-content-center align-items-start">
            {!isGithubAuth ? (
              <div>
                <div className="mb-3">
                  <span style={{ fontSize: '3rem' }}>🔐</span>
                </div>
                <h4 className="mb-3 fw-bold" style={{ color: 'white', fontSize: '1.6rem' }}>Authentication Required</h4>
                <p className="text-secondary m-0" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                  Login with GitHub to unlock repository creation.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-3">
                  <span style={{ fontSize: '3rem' }}>📦</span>
                </div>
                <h4 className="mb-4 fw-bold" style={{ color: 'white', fontSize: '1.6rem' }}>Ready to start?</h4>
                <Link to="/my-profile/create-repository" className="btn btn-primary pill-btn px-5" style={{ fontSize: '1.1rem', padding: '14px 32px' }}>
                  Create Repository
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
