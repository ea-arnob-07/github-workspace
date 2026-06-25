import './ErrorMessage.css';

/**
 * ErrorMessage — Displays an error with optional retry button.
 */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container glass-card">
      <span className="error-icon">⚠️</span>
      <h3>Something went wrong</h3>
      <p>{message || 'An unexpected error occurred.'}</p>
      {onRetry && (
        <button className="btn btn-secondary mt-4" onClick={onRetry}>
          🔄 Try Again
        </button>
      )}
    </div>
  );
}
