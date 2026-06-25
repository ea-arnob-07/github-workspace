export default function Collections() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📁 Collections</h1>
        <p>Organize repositories into personal collections</p>
      </div>
      <div className="empty-state card">
        <div className="empty-state-icon">📁</div>
        <h3>No collections yet</h3>
        <p>Create your first collection to organize repositories.</p>
      </div>
    </div>
  );
}
