import { Bell, CheckCircle, Info } from 'lucide-react';

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    type: 'info',
    icon: <Bell size={16} />,
    title: 'Welcome to GitHub Workspace!',
    message: 'Explore repositories, follow developers, and build amazing collections.',
    time: 'Just now',
    unread: true,
  },
  {
    id: 2,
    type: 'success',
    icon: <CheckCircle size={16} />,
    title: 'Profile Connected',
    message: 'Your session is active. Explore and discover repositories.',
    time: 'Today',
    unread: false,
  },
];

export default function Notifications() {
  return (
    <div className="page-container animate-fade-in">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
        <div style={{
          width: '48px', height: '48px', display: 'grid', placeItems: 'center',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(139,92,246,0.15))',
          border: '1px solid rgba(139,92,246,0.3)',
          color: '#a78bfa',
          boxShadow: '0 4px 16px rgba(124,58,237,0.2)'
        }}>
          <Bell size={22} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            Notifications
          </h1>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Your recent activity and alerts
          </p>
        </div>

        {/* All caught up badge */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px',
          padding: '6px 14px', borderRadius: '999px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          color: '#10b981', fontSize: '0.78rem', fontWeight: 700
        }}>
          <CheckCircle size={14} />
          All caught up
        </div>
      </div>

      {/* Notification Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '720px' }}>
        {SAMPLE_NOTIFICATIONS.map((notif) => (
          <div key={notif.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: '14px',
            padding: '18px 20px',
            borderRadius: '16px',
            background: notif.unread
              ? 'linear-gradient(135deg, rgba(124,58,237,0.10), rgba(139,92,246,0.04))'
              : 'var(--color-glass-bg)',
            border: notif.unread
              ? '1px solid rgba(139,92,246,0.25)'
              : '1px solid var(--color-border-glass)',
            backdropFilter: 'blur(20px)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default',
            position: 'relative',
          }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {/* Unread dot */}
            {notif.unread && (
              <div style={{
                position: 'absolute', top: '18px', right: '18px',
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#7c3aed', boxShadow: '0 0 8px rgba(124,58,237,0.6)'
              }} />
            )}

            {/* Icon */}
            <div style={{
              width: '38px', height: '38px', flexShrink: 0, borderRadius: '11px',
              display: 'grid', placeItems: 'center',
              background: notif.type === 'success'
                ? 'rgba(16,185,129,0.15)'
                : 'rgba(124,58,237,0.15)',
              border: `1px solid ${notif.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(139,92,246,0.25)'}`,
              color: notif.type === 'success' ? '#10b981' : '#a78bfa',
            }}>
              {notif.icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '4px'
              }}>
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {notif.title}
                </h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', opacity: 0.7 }}>
                  {notif.time}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {notif.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
