import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  getRepo, getRepoContributors, getRepoIssues,
  getRepoBranches, getRepoCommits, getRepoContents, getFileContent,
  getRepoLanguages,
} from '../services/githubApi';
import { formatNumber, formatRelativeTime, getLanguageColor } from '../utils/helpers';
import Tabs from '../components/common/Tabs';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import FileTree from '../components/repositories/FileTree';
import CodePreview from '../components/repositories/CodePreview';
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

  // ── Language breakdown state ──
  const [languages, setLanguages] = useState(null);

  // ── Code tab state ──
  const [currentPath, setCurrentPath] = useState('');
  const [dirContents, setDirContents] = useState([]);
  const [dirLoading, setDirLoading] = useState(false);
  const [dirError, setDirError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState(null);

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
      // Fetch languages in background (non-blocking)
      getRepoLanguages(owner, repoName)
        .then((langs) => setLanguages(langs))
        .catch(() => setLanguages(null));
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
    // Reset code tab state
    setCurrentPath('');
    setDirContents([]);
    setSelectedFile(null);
    setFileData(null);
  }, [fetchRepo]);

  // ── Fetch directory contents ──
  const fetchDirContents = useCallback(async (path = '') => {
    setDirLoading(true);
    setDirError(null);
    try {
      const data = await getRepoContents(owner, repoName, path);
      setDirContents(Array.isArray(data) ? data : []);
      setCurrentPath(path);
    } catch (err) {
      setDirError(err.message);
      setDirContents([]);
    } finally {
      setDirLoading(false);
    }
  }, [owner, repoName]);

  // ── Fetch file content ──
  const fetchFileContent = useCallback(async (file) => {
    setSelectedFile(file);
    setFileLoading(true);
    setFileError(null);
    setFileData(null);
    try {
      const data = await getFileContent(owner, repoName, file.path);
      setFileData(data);
    } catch (err) {
      setFileError(err.message);
    } finally {
      setFileLoading(false);
    }
  }, [owner, repoName]);

  const handleTabChange = async (tabId) => {
    setActiveTab(tabId);

    // Code tab: load root contents on first visit
    if (tabId === 'code') {
      if (dirContents.length === 0 && !dirError) {
        fetchDirContents('');
      }
      return;
    }

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

  // ── Code tab handlers ──
  const handleFolderClick = (folder) => {
    fetchDirContents(folder.path);
    // Clear selected file when navigating folders
    setSelectedFile(null);
    setFileData(null);
    setFileError(null);
  };

  const handleFileClick = (file) => {
    fetchFileContent(file);
  };

  const handleBreadcrumbClick = (path) => {
    fetchDirContents(path);
    setSelectedFile(null);
    setFileData(null);
    setFileError(null);
  };

  if (loading) return <div className="page-container"><LoadingSpinner text="Loading repository..." /></div>;
  if (error) return <div className="page-container"><ErrorMessage message={error} onRetry={fetchRepo} /></div>;
  if (!repo) return null;

  const defaultBranch = repo.default_branch || 'main';
  const zipUrl = `https://github.com/${owner}/${repoName}/archive/refs/heads/${defaultBranch}.zip`;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'code', label: 'Code', icon: '💻' },
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
          <div className="repo-header-actions">
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                title="View deployed website"
              >
                🌐 Live Preview
              </a>
            )}
            <a
              href={`https://${owner}.github.io/${repoName}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              title="View GitHub Pages Webpage"
            >
              🌐 Webpage
            </a>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              title="Open on GitHub"
            >
              🔗 Open on GitHub
            </a>
            <a
              href={zipUrl}
              download
              className="btn btn-secondary"
              title="Download source as ZIP"
            >
              📥 Download ZIP
            </a>
            <button 
              className={`btn ${isFavorite ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={toggleFavorite}
            >
              {isFavorite ? '⭐ Favorited' : '☆ Favorite'}
            </button>
          </div>
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
          <>
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

            {/* Language Breakdown */}
            {languages && Object.keys(languages).length > 0 && (() => {
              const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
              const langEntries = Object.entries(languages)
                .sort(([, a], [, b]) => b - a)
                .map(([name, bytes]) => ({
                  name,
                  bytes,
                  percentage: ((bytes / totalBytes) * 100),
                }));

              return (
                <div className="card animate-fade-in">
                  <h3 className="mb-4">🎨 Languages</h3>
                  <div className="lang-bar">
                    {langEntries.map((lang) => (
                      <div
                        key={lang.name}
                        className="lang-bar-segment"
                        style={{
                          width: `${Math.max(lang.percentage, 0.5)}%`,
                          background: getLanguageColor(lang.name),
                        }}
                        title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
                      />
                    ))}
                  </div>
                  <div className="lang-legend">
                    {langEntries.map((lang) => (
                      <div key={lang.name} className="lang-legend-item">
                        <span className="lang-dot" style={{ background: getLanguageColor(lang.name) }} />
                        <span className="lang-legend-name">{lang.name}</span>
                        <span className="lang-legend-pct">{lang.percentage.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </>
        )}

        {/* ══════ CODE TAB ══════ */}
        {!tabLoading && activeTab === 'code' && (
          <div className="code-tab-layout animate-fade-in">
            <div className="code-tab-tree glass-card">
              <FileTree
                items={dirContents}
                currentPath={currentPath}
                selectedFile={selectedFile}
                loading={dirLoading}
                error={dirError}
                onFolderClick={handleFolderClick}
                onFileClick={handleFileClick}
                onBreadcrumbClick={handleBreadcrumbClick}
                onRetry={() => fetchDirContents(currentPath)}
              />
            </div>
            <div className="code-tab-preview">
              <CodePreview
                file={fileData}
                loading={fileLoading}
                error={fileError}
              />
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
