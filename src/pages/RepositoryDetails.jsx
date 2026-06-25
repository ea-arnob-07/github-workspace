import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  getRepo, getRepoContributors, getRepoIssues,
  getRepoBranches, getRepoCommits,
} from '../services/githubApi';
import { formatNumber, formatRelativeTime, getLanguageColor } from '../utils/helpers';
import Tabs from '../components/common/Tabs';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './RepositoryDetails.css';

/**
 * RepositoryDetails Page — Shows repo info with tabs.
 * Route: /repos/:owner/:repo
 */
export default function RepositoryDetails() {
  const { owner, repo: repoName } = useParams();
  const [repo, setRepo] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [tabData, setTabData] = useState({});
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useLocalStorage('github-favorites', []);

  const isFavorite = repo && favorites.some((fav) => fav.id === repo.id);
  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.id !== repo.id));
    } else {
      setFavorites([
        ...favorites,
        {
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          owner: repo.owner.login,
          avatar_url: repo.owner.avatar_url,
          stargazers_count: repo.stargazers_count,
          description: repo.description,
          type: 'repository'
        }
      ]);
    }
  };

  const fetchRepo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRepo(owner, repoName);
      setRepo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [owner, repoName]);

  useEffect(() => {
    fetchRepo();
    setActiveTab('overview');
    setTabData({});
  }, [fetchRepo]);

  const handleTabChange = async (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'overview' || tabData[tabId]) return;

    setTabLoading(true);
    try {
      let data;
      switch (tabId) {
        case 'contributors': data = await getRepoContributors(owner, repoName, 1, 30); break;
        case 'issues': data = await getRepoIssues(owner, repoName, 1, 30); break;
        case 'branches': data = await getRepoBranches(owner, repoName, 1, 30); break;
        case 'commits': data = await getRepoCommits(owner, repoName, 1, 30); break;
      }
      setTabData((prev) => ({ ...prev, [tabId]: data }));
    } catch { /* ignore */ }
    finally { setTabLoading(false); }
  };

  if (loading) return <div className="page-container"><LoadingSpinner text="Loading repository..." /></div>;
  if (error) return <div className="page-container"><ErrorMessage message={error} onRetry={fetchRepo} /></div>;
  if (!repo) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'contributors', label: 'Contributors', icon: '👥' },
    { id: 'issues', label: 'Issues', icon: '🔴', count: repo.open_issues_count },
    { id: 'branches', label: 'Branches', icon: '🌿' },
    { id: 'commits', label: 'Commits', icon: '📝' },
  ];

  return (
    <div className="page-container">
      {/* Repo Header */}
      <div className="repo-header glass-card animate-fade-in-up">
        <div className="repo-header-top">
          <div className="repo-header-title">
            <span className="repo-icon-lg">📦</span>
            <div>
              <h1>
                <Link to={`/users/${owner}`} className="repo-owner-link">{owner}</Link>
                <span className="repo-separator">/</span>
                {repoName}
              </h1>
              {repo.description && <p className="repo-desc">{repo.description}</p>}
            </div>
          </div>
          <button 
            className={`btn ${isFavorite ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={toggleFavorite}
          >
            {isFavorite ? '⭐ Favorited' : '☆ Favorite'}
          </button>
        </div>

        <div className="repo-stats-bar">
          <div className="repo-stat-item">
            <span>⭐</span> <strong>{formatNumber(repo.stargazers_count)}</strong> Stars
          </div>
          <div className="repo-stat-item">
            <span>🔀</span> <strong>{formatNumber(repo.forks_count)}</strong> Forks
          </div>
          <div className="repo-stat-item">
            <span>👁️</span> <strong>{formatNumber(repo.watchers_count)}</strong> Watchers
          </div>
          <div className="repo-stat-item">
            <span>🔴</span> <strong>{formatNumber(repo.open_issues_count)}</strong> Issues
          </div>
          {repo.language && (
            <div className="repo-stat-item">
              <span className="lang-dot" style={{ background: getLanguageColor(repo.language) }} />
              <strong>{repo.language}</strong>
            </div>
          )}
        </div>

        {repo.topics && repo.topics.length > 0 && (
          <div className="repo-topics">
            {repo.topics.map((topic) => (
              <span key={topic} className="tag">{topic}</span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

      {/* Tab Content */}
      <div className="repo-tab-content">
        {tabLoading && <LoadingSpinner text="Loading..." size="sm" />}

        {!tabLoading && activeTab === 'overview' && (
          <div className="card animate-fade-in">
            <h3 className="mb-4">📋 Repository Info</h3>
            <div className="overview-grid">
              <div className="overview-item">
                <span className="overview-label">Created</span>
                <span>{formatRelativeTime(repo.created_at)}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Last Updated</span>
                <span>{formatRelativeTime(repo.updated_at)}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Default Branch</span>
                <span className="badge badge-accent">{repo.default_branch}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">License</span>
                <span>{repo.license?.spdx_id || 'None'}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Size</span>
                <span>{(repo.size / 1024).toFixed(1)} MB</span>
              </div>
              {repo.homepage && (
                <div className="overview-item">
                  <span className="overview-label">Homepage</span>
                  <a href={repo.homepage} target="_blank" rel="noreferrer">{repo.homepage}</a>
                </div>
              )}
            </div>
          </div>
        )}

        {!tabLoading && activeTab === 'contributors' && (
          <div className="grid grid-3 stagger-children">
            {(tabData.contributors || []).map((c) => (
              <Link key={c.id} to={`/users/${c.login}`} className="contributor-card glass-card">
                <img src={c.avatar_url} alt={c.login} className="follower-avatar" />
                <div>
                  <div className="follower-name">@{c.login}</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    {c.contributions} contributions
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!tabLoading && activeTab === 'issues' && (
          <div className="stagger-children">
            {(tabData.issues || []).length === 0 ? (
              <div className="empty-state card">
                <div className="empty-state-icon">🎉</div>
                <h3>No open issues</h3>
              </div>
            ) : (
              (tabData.issues || []).map((issue) => (
                <div key={issue.id} className="issue-item card">
                  <div className="issue-header">
                    <span className={`issue-state ${issue.pull_request ? 'issue-pr' : ''}`}>
                      {issue.pull_request ? '🔀' : '🔴'}
                    </span>
                    <a href={issue.html_url} target="_blank" rel="noreferrer" className="issue-title">
                      {issue.title}
                    </a>
                  </div>
                  <div className="issue-meta text-xs">
                    #{issue.number} opened {formatRelativeTime(issue.created_at)} by {issue.user?.login}
                  </div>
                  {issue.labels?.length > 0 && (
                    <div className="issue-labels">
                      {issue.labels.map((l) => (
                        <span key={l.id} className="badge" style={{
                          background: `#${l.color}22`,
                          color: `#${l.color}`,
                        }}>
                          {l.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {!tabLoading && activeTab === 'branches' && (
          <div className="stagger-children">
            {(tabData.branches || []).map((b) => (
              <div key={b.name} className="branch-item card">
                <span className="branch-icon">🌿</span>
                <span className="branch-name">{b.name}</span>
                {b.protected && <span className="badge badge-warning">protected</span>}
              </div>
            ))}
          </div>
        )}

        {!tabLoading && activeTab === 'commits' && (
          <div className="stagger-children">
            {(tabData.commits || []).map((c, idx) => (
              <div key={c.sha || idx} className="commit-item card">
                <div className="commit-header">
                  <span className="commit-msg">{c.commit?.message?.split('\n')[0]}</span>
                </div>
                <div className="commit-meta text-xs">
                  <span>{c.commit?.author?.name}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(c.commit?.author?.date)}</span>
                  <span>•</span>
                  <code className="commit-sha">{c.sha?.slice(0, 7)}</code>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
