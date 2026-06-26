import { useState, useEffect } from 'react';
import { enableGitHubPages, getGitHubPagesStatus } from '../../services/githubUserApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './GitHubPagesStatus.css';

export default function GitHubPagesStatus({ owner, repo }) {
  const [status, setStatus] = useState(null); // null means not checked, or not enabled
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enabling, setEnabling] = useState(false);
  const [pagesSource, setPagesSource] = useState({ branch: 'main', path: '/' });

  const fetchStatus = async () => {
    try {
      const data = await getGitHubPagesStatus(owner, repo);
      setStatus(data);
    } catch (err) {
      if (err.message.includes('404')) {
        setStatus(null); // Not enabled
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [owner, repo]);

  // Polling if status is building/processing
  useEffect(() => {
    let intervalId;
    if (status && status.status !== 'built' && status.status !== 'errored') {
      intervalId = setInterval(() => {
        fetchStatus();
      }, 15000); // poll every 15 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [status, owner, repo]);

  const handleEnable = async () => {
    setEnabling(true);
    setError(null);
    try {
      await enableGitHubPages(owner, repo, pagesSource.branch, pagesSource.path);
      // It might take a moment to be available in the status API, wait a bit
      setTimeout(() => {
        fetchStatus();
        setEnabling(false);
      }, 3000);
    } catch (err) {
      setError(err.message);
      setEnabling(false);
    }
  };

  if (loading) {
    return (
      <div className="pages-status-card glass-card p-4">
        <LoadingSpinner text="Checking GitHub Pages status..." />
      </div>
    );
  }

  // Not enabled
  if (!status) {
    return (
      <div className="pages-status-card glass-card p-4">
        <h3 className="mb-3">GitHub Pages</h3>
        <p className="text-secondary mb-4">
          Host your repository as a website using GitHub Pages. Ensure you have an index.html file in your source branch.
        </p>

        {error && <ErrorMessage message={error} className="mb-3" />}

        <div className="d-flex gap-3 mb-4 flex-wrap">
          <div className="flex-1 min-w-200">
            <label className="d-block mb-1 text-sm text-tertiary">Source Branch</label>
            <select 
              className="form-control glass-input"
              value={pagesSource.branch}
              onChange={(e) => setPagesSource(prev => ({ ...prev, branch: e.target.value }))}
            >
              <option value="main">main</option>
              <option value="master">master</option>
            </select>
          </div>
          <div className="flex-1 min-w-200">
            <label className="d-block mb-1 text-sm text-tertiary">Folder</label>
            <select 
              className="form-control glass-input"
              value={pagesSource.path}
              onChange={(e) => setPagesSource(prev => ({ ...prev, path: e.target.value }))}
            >
              <option value="/">/(root)</option>
              <option value="/docs">/docs</option>
            </select>
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleEnable}
          disabled={enabling}
        >
          {enabling ? 'Enabling...' : 'Enable GitHub Pages'}
        </button>
      </div>
    );
  }

  // Processing or Published
  const isPublished = status.status === 'built';
  const expectedUrl = status.html_url || `https://${owner}.github.io/${repo}/`;

  return (
    <div className="pages-status-card glass-card p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h3 className="m-0">GitHub Pages</h3>
        <span className={`badge ${isPublished ? 'badge-success' : 'badge-warning'}`}>
          {isPublished ? 'Published' : 'Processing'}
        </span>
      </div>

      {!isPublished ? (
        <div className="processing-state text-center py-4">
          <div className="spinner mb-3" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
          <h4>Your site is being built</h4>
          <p className="text-secondary mt-2">
            This usually takes 1-10 minutes. The status will update automatically.
          </p>
          <div className="mt-3 text-sm text-tertiary">
            Expected URL: {expectedUrl}
          </div>
        </div>
      ) : (
        <div className="published-state">
          <div className="success-icon text-center mb-3">
            <span style={{ fontSize: '3rem' }}>✅</span>
          </div>
          <h4 className="text-center mb-3">Your site is live!</h4>
          
          <div className="url-container glass-input mb-4 d-flex align-items-center justify-content-between">
            <a href={expectedUrl} target="_blank" rel="noopener noreferrer" className="published-url">
              {expectedUrl}
            </a>
            <button 
              className="btn btn-sm btn-secondary"
              onClick={() => navigator.clipboard.writeText(expectedUrl)}
            >
              Copy
            </button>
          </div>
          
          <div className="text-center">
            <a href={expectedUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary px-5">
              Visit Site
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
