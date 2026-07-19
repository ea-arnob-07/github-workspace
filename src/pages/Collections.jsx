import { Folder, Plus, Sparkles } from 'lucide-react';

export default function Collections() {
  return (
    <div className="page-container animate-fade-in">

      {/* Header */}
      <div className="page-header-modern" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px', height: '48px', display: 'grid', placeItems: 'center',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(139,92,246,0.15))',
            border: '1px solid rgba(139,92,246,0.3)',
            color: '#a78bfa',
            boxShadow: '0 4px 16px rgba(124,58,237,0.2)'
          }}>
            <Folder size={22} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              Collections
            </h1>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Organize repositories into personal collections
            </p>
          </div>
        </div>
      </div>

      {/* Empty state */}
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
        {/* Animated icon cluster */}
        <div style={{ position: 'relative', width: '90px', height: '90px' }}>
          <div style={{
            width: '90px', height: '90px', borderRadius: '26px', display: 'grid', placeItems: 'center',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(139,92,246,0.10))',
            border: '1px solid rgba(139,92,246,0.25)',
            boxShadow: '0 0 40px rgba(124,58,237,0.15)',
            animation: 'float 3s ease-in-out infinite'
          }}>
            <Folder size={40} style={{ color: '#a78bfa' }} />
          </div>
          <div style={{
            position: 'absolute', top: '-8px', right: '-8px',
            width: '26px', height: '26px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 4px 12px rgba(124,58,237,0.4)'
          }}>
            <Sparkles size={12} style={{ color: 'white' }} />
          </div>
        </div>

        <div>
          <h3 style={{ margin: '0 0 8px', fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            No collections yet
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '340px', lineHeight: 1.6 }}>
            Group your favorite repositories into organized collections. Keep your projects neat and find them instantly.
          </p>
        </div>

        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          color: 'white', border: 'none', borderRadius: '12px',
          fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(124,58,237,0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(124,58,237,0.4)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,58,237,0.3)'; }}
        >
          <Plus size={16} />
          Create Collection
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
