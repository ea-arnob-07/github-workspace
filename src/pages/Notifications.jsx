export default function Notifications() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔔 Notifications</h1>
        <p>Your recent notifications</p>
      </div>
      <div className="empty-state card">
        <div className="empty-state-icon">🔔</div>
        <h3>No notifications</h3>
        <p>You're all caught up! Notifications will appear here as you use the app.</p>
      </div>
    </div>
  );
}
