import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Star } from 'lucide-react';
import './Dashboard.css'; // Reusing dashboard masonry styles

export default function Favorites() {
  const [favorites] = useLocalStorage('github-favorites', []);

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
        <div style={{
          width: '48px', height: '48px', display: 'grid', placeItems: 'center',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.30), rgba(251,191,36,0.12))',
          border: '1px solid rgba(245,158,11,0.30)',
          color: '#fbbf24',
          boxShadow: '0 4px 16px rgba(245,158,11,0.18)'
        }}>
          <Star size={22} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            Favorites
          </h1>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Your favorited repositories and developers
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '80px 40px', borderRadius: '24px',
          background: 'var(--color-glass-bg)',
          border: '1px solid var(--color-border-glass)',
          backdropFilter: 'blur(20px)',
          textAlign: 'center',
          gap: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }}>
          <div style={{
            width: '90px', height: '90px', borderRadius: '26px', display: 'grid', placeItems: 'center',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.22), rgba(251,191,36,0.08))',
            border: '1px solid rgba(245,158,11,0.25)',
            boxShadow: '0 0 40px rgba(245,158,11,0.12)',
            animation: 'float 3s ease-in-out infinite'
          }}>
            <Star size={40} style={{ color: '#fbbf24' }} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              No favorites yet
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '340px', lineHeight: 1.6 }}>
              Star repositories and developers you love. They'll appear here for quick access anytime.
            </p>
          </div>
          <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
        </div>
      ) : (
        <div className="dashboard-masonry">
          {favorites.map((fav) => (
            <Link 
              key={fav.id} 
              to={fav.type === 'repository' ? `/repos/${fav.full_name || `${fav.owner}/${fav.name}`}` : `/users/${fav.owner}`} 
              className="action-card glass-card favorite-theme-card"
            >
              <div className="card-header-badge">Favorite</div>
              <span className="action-icon" style={{ overflow: 'hidden', padding: 0, background: 'var(--color-warning-muted)' }}>
                <img src={fav.avatar_url} alt={fav.owner} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
              </span>
              <h3 style={{ wordBreak: 'break-all' }}>{fav.type === 'repository' ? fav.name : fav.owner}</h3>
              <p>{fav.description || 'No description available.'}</p>
              <div className="action-footer">
                <span className="btn-ghost">View {fav.type === 'repository' ? 'Repository' : 'User'} </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
