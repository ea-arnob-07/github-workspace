import { Link } from 'react-router-dom';
import './UserCard.css';

/**
 * UserCard — Displays a GitHub user in a glass card.
 * @param {{ user: Object, onFavorite?: Function, isFavorited?: boolean }} props
 */
export default function UserCard({ user, onFavorite, isFavorited }) {
  return (
    <div className="user-card glass-card">
      <Link to={`/users/${user.login}`} className="user-card-link">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="user-card-avatar"
          loading="lazy"
        />
        <div className="user-card-info">
          <h4 className="user-card-name">{user.name || user.login}</h4>
          <span className="user-card-username">@{user.login}</span>
          {user.bio && <p className="user-card-bio">{user.bio}</p>}
          {(user.followers !== undefined) && (
            <div className="user-card-stats">
              <span>👥 {user.followers} followers</span>
              <span>📦 {user.public_repos} repos</span>
            </div>
          )}
        </div>
      </Link>
      {onFavorite && (
        <button
          className={`user-card-fav btn-ghost btn-icon ${isFavorited ? 'favorited' : ''}`}
          onClick={(e) => { e.stopPropagation(); onFavorite(user); }}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorited ? '★' : '☆'}
        </button>
      )}
    </div>
  );
}
