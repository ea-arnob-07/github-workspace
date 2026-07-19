import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserRepos } from '../services/githubApi';
import MyRepoCard from '../components/github/MyRepoCard';
import GitHubLoginButton from '../components/github/GitHubLoginButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './MyProfile.css';

/* ─── Auth Required Modal ─── */
function AuthModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeInBackdrop 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '420px',
          margin: '0 20px',
          background: 'linear-gradient(145deg, rgba(30, 18, 60, 0.96), rgba(18, 10, 40, 0.98))',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '24px',
          padding: '40px 36px 32px',
          boxShadow: '0 0 0 1px rgba(139,92,246,0.15), 0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.15)',
          textAlign: 'center',
          animation: 'slideUpModal 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          position: 'relative',
        }}
      >
        {/* Top glow orb */}
        <div style={{
          position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(124,58,237,0.6), 0 8px 24px rgba(0,0,0,0.4)',
          border: '3px solid rgba(255,255,255,0.12)',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        {/* Content */}
        <div style={{ marginTop: '28px' }}>
          <h2 style={{
            margin: '0 0 10px',
            fontSize: '1.4rem', fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}>
            Authentication Required
          </h2>
          <p style={{
            margin: '0 0 28px',
            fontSize: '0.92rem',
            color: 'rgba(200,185,255,0.80)',
            lineHeight: 1.6,
          }}>
            Login with GitHub to unlock repository creation and access all developer features.
          </p>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)',
            marginBottom: '24px',
          }} />

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '13px',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(124,58,237,0.5)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,58,237,0.4)'; }}
            >
              Got it
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '11px',
                background: 'transparent',
                color: 'rgba(200,185,255,0.6)',
                border: '1px solid rgba(139,92,246,0.20)',
                borderRadius: '12px',
                fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)'; e.currentTarget.style.color = 'rgba(200,185,255,0.9)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.20)'; e.currentTarget.style.color = 'rgba(200,185,255,0.6)'; }}
            >
              Dismiss
            </button>
          </div>
        </div>

        <style>{`
          @keyframes fadeInBackdrop { from { opacity: 0 } to { opacity: 1 } }
          @keyframes slideUpModal {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to   { opacity: 1; transform: translateY(0)   scale(1);    }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function MyProfile() {
  const { isGithubAuth, githubUser, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      <div className="mb-4">
        <h1 className="m-0" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>GitHub Connect</h1>
      </div>

      {/* AUTH STATUS / LOGIN BUTTON */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginBottom: '40px' }}>
        {!isGithubAuth ? (
          <div style={{ width: '400px' }}>
            <GitHubLoginButton />
          </div>
        ) : (
          <div className="logged-in-badge px-4 py-2" style={{ borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'var(--color-gradient-accent)', color: '#ffffff', border: 'none', boxShadow: '0 8px 32px rgba(161, 140, 209, 0.4)' }}>
            <img src={githubUser.avatar_url} alt={githubUser.login} className="header-avatar" />
            <div className="text-start">
              <div className="fw-bold">{githubUser.login}</div>
              <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Authenticated</div>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card custom-card" style={{ maxWidth: '850px', margin: '0 auto', padding: '36px 40px', marginBottom: '40px', borderRadius: '24px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-text-primary)', textAlign: 'center', marginBottom: '24px' }}>
          Repository Dashboard
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', justifyContent: 'center' }}>
          {/* Search Section */}
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <form onSubmit={handleSearchSubmit} className="search-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                className="form-control glass-input custom-input"
                placeholder="Search GitHub username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '1rem', padding: '12px 16px', borderRadius: '10px', textAlign: 'center' }}
              />
              <button
                type="submit"
                className="btn btn-primary px-4 py-2"
                disabled={loadingRepos}
                style={{ borderRadius: '10px', fontWeight: '600', width: '100%' }}
              >
                Search Repositories
              </button>
            </form>
          </div>

          {/* Divider */}
          <div style={{ color: 'var(--color-text-secondary)', fontWeight: 'bold', fontSize: '0.9rem', opacity: 0.6 }}>
            OR
          </div>

          {/* Create New Repository Button */}
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <button
              className="btn"
              style={{
                width: '100%',
                background: 'var(--color-gradient-accent)',
                color: 'white', border: 'none',
                fontSize: '1.05rem', fontWeight: 'bold',
                borderRadius: '12px', padding: '16px',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.25)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(124, 58, 237, 0.35)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.25)'; }}
              onClick={() => {
                if (!isGithubAuth) {
                  setShowAuthModal(true);
                } else {
                  navigate('/my-profile/create-repository');
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create New Repository
            </button>
          </div>
        </div>
      </div>

      <div className="repo-results w-100 mt-4">
        {loadingRepos ? (
          <div className="py-4"><LoadingSpinner text="Fetching..." /></div>
        ) : error ? (
          <ErrorMessage message={error} className="mt-2" />
        ) : repos.length > 0 ? (
          <div className="repo-list d-flex flex-column gap-3">
            {repos.map(repo => (
              <MyRepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
