import './LoadingSpinner.css';

/**
 * LoadingSpinner — Animated loading indicator.
 * @param {{ size, text }} props
 */
export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner-ring">
        <div className="spinner-ring-inner" />
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
