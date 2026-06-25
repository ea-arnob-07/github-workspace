import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Dashboard.css'; // Reusing dashboard masonry styles

export default function Favorites() {
  const [favorites] = useLocalStorage('github-favorites', []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>⭐ Favorites</h1>
        <p>Your favorited repositories and developers</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">⭐</div>
          <h3>No favorites yet</h3>
          <p>Start exploring and add repos or users to your favorites.</p>
        </div>
      ) : (
        <div className="dashboard-masonry">
          {favorites.map((fav) => (
            <Link 
              key={fav.id} 
              to={fav.type === 'repository' ? `/repos/${fav.full_name}` : `/users/${fav.owner}`} 
              className="action-card glass-card"
            >
              <div className="card-header-badge text-warning">Favorite</div>
              <span className="action-icon" style={{ overflow: 'hidden', padding: 0, background: 'var(--color-warning-muted)' }}>
                <img src={fav.avatar_url} alt={fav.owner} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
              </span>
              <h3 style={{ wordBreak: 'break-all' }}>{fav.type === 'repository' ? fav.name : fav.owner}</h3>
              <p>{fav.description || 'No description available.'}</p>
              <div className="action-footer">
                <span className="btn-ghost">View {fav.type === 'repository' ? 'Repository' : 'User'} →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
