import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FileUploader from '../components/github/FileUploader';
import GitHubPagesStatus from '../components/github/GitHubPagesStatus';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './MyRepositoryManager.css';

export default function MyRepositoryManager() {
  const { owner, repo } = useParams();
  const { isGithubAuth, isAuthLoading } = useAuth();
  
  // We can fetch initial repository data here if needed, but for now we focus on the requested features
  
  const handleUploadSuccess = () => {
    // We could refresh the repo data here, or show a notification
    console.log('Upload successful');
  };

  if (isAuthLoading) {
    return <div className="page-container"><LoadingSpinner /></div>;
  }

  if (!isGithubAuth) {
    return <div className="page-container">Please login with GitHub first.</div>;
  }

  return (
    <div className="page-container animate-fade-in my-repo-manager">
      <div className="mb-4">
        <Link to="/my-profile" className="back-link d-inline-block mb-3">
          ← Back to Profile
        </Link>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h1>
            <span className="text-tertiary">{owner} / </span>
            {repo}
          </h1>
          <a 
            href={`https://github.com/${owner}/${repo}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary d-flex align-items-center gap-2"
          >
            <svg height="20" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="20" data-view-component="true" fill="currentColor">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.46-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
            Open on GitHub
          </a>
        </div>
      </div>

      <div className="manager-grid">
        <div className="manager-main">
          <FileUploader 
            owner={owner} 
            repo={repo} 
            onSuccess={handleUploadSuccess} 
          />
        </div>
        
        <div className="manager-sidebar">
          <GitHubPagesStatus 
            owner={owner} 
            repo={repo} 
          />
          
          <div className="glass-card mt-4 p-4">
            <h3 className="mb-3 text-sm text-tertiary">Quick Links</h3>
            <ul className="quick-links">
              <li>
                <Link to={`/repos/${owner}/${repo}`}>View Repository Details</Link>
              </li>
              <li>
                <a href={`https://github.com/${owner}/${repo}/settings`} target="_blank" rel="noopener noreferrer">
                  GitHub Repository Settings ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
