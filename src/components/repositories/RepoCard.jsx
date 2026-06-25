import { Link } from 'react-router-dom';
import { formatNumber } from '../../utils/helpers';
import { getLanguageColor } from '../../utils/helpers';
import './RepoCard.css';

/**
 * RepoCard — Displays a GitHub repository in a glass card.
 */
export default function RepoCard({ repo, onFavorite, isFavorited }) {
  return (
    <div className="repo-card glass-card">
      <Link
        to={`/repos/${repo.owner?.login || repo.owner}/${repo.name}`}
        className="repo-card-link"
      >
        <div className="repo-card-header">
          <span className="repo-card-icon">📦</span>
          <h4 className="repo-card-name">
            <span className="repo-owner">{repo.owner?.login || repo.owner}/</span>
            {repo.name}
          </h4>
        </div>

        {repo.description && (
          <p className="repo-card-desc">{repo.description}</p>
        )}

        <div className="repo-card-meta">
          {repo.language && (
            <span className="repo-lang">
              <span
                className="lang-dot"
                style={{ background: getLanguageColor(repo.language) }}
              />
              {repo.language}
            </span>
          )}
          <span className="repo-stat">⭐ {formatNumber(repo.stargazers_count)}</span>
          <span className="repo-stat">🔀 {formatNumber(repo.forks_count)}</span>
          {repo.open_issues_count > 0 && (
            <span className="repo-stat">🔴 {formatNumber(repo.open_issues_count)}</span>
          )}
        </div>
      </Link>

      {onFavorite && (
        <button
          className={`repo-card-fav btn-ghost btn-icon ${isFavorited ? 'favorited' : ''}`}
          onClick={(e) => { e.stopPropagation(); onFavorite(repo); }}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorited ? '★' : '☆'}
        </button>
      )}
    </div>
  );
}
