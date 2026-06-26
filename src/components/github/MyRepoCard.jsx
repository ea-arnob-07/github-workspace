import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/helpers';
import './MyRepoCard.css';

export default function MyRepoCard({ repo }) {
  return (
    <div className="my-repo-card glass-card animate-fade-in-up">
      <div className="my-repo-header">
        <h3 className="my-repo-title">
          <Link to={`/my-profile/repos/${repo.owner.login}/${repo.name}`}>
            {repo.name}
          </Link>
        </h3>
        <span className={`badge ${repo.private ? 'badge-private' : 'badge-public'}`}>
          {repo.private ? 'Private' : 'Public'}
        </span>
      </div>
      
      {repo.description && (
        <p className="my-repo-desc">{repo.description}</p>
      )}

      <div className="my-repo-meta">
        <div className="meta-item" title="Stars">⭐ {repo.stargazers_count}</div>
        <div className="meta-item" title="Forks">🔀 {repo.forks_count}</div>
        <div className="meta-item" title="Default branch">🌿 {repo.default_branch}</div>
        <div className="meta-item" title="Last updated">🕒 {formatRelativeTime(repo.updated_at)}</div>
      </div>

      <div className="my-repo-actions">
        <a 
          href={repo.html_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-secondary btn-sm"
        >
          Open on GitHub
        </a>
        <Link 
          to={`/my-profile/repos/${repo.owner.login}/${repo.name}`}
          className="btn btn-primary btn-sm"
        >
          Manage Repo
        </Link>
      </div>
    </div>
  );
}
