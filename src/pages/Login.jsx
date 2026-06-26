import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateLogin } from '../utils/validators';
import GitHubLoginButton from '../components/github/GitHubLoginButton';
import './Auth.css';

/**
 * Login Page — Fake authentication with email/password.
 * Redirects to the page the user was trying to visit, or /dashboard.
 */
export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to redirect after login
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const validationErrors = validateLogin(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setServerError('');

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));

    const result = login({
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in-up">
        
        {/* Left Side Image Panel */}
        <div className="auth-left-panel">
          <div className="auth-left-content">
            <h2>It’s easy to find<br/>GitHub Repository</h2>
            <p>See how beautiful life can be when you’re in touch with <span className="text-theme-green">ARNOB</span>.</p>
            <div className="auth-features">
              <span><i className="feature-icon">✓</i> Easy Lifestyle</span>
              <span><i className="feature-icon">✓</i> Safe & secure</span>
              <span><i className="feature-icon">✓</i> No maintaining balance</span>
            </div>
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="auth-right-panel">
          <div className="auth-header">
            <span className="auth-logo maya-logo">GitHub<span className="bank-badge">Workspace</span></span>
            <p className="welcome-text">Welcome back!</p>
            <h1>Log in to your account</h1>
          </div>

          {serverError && (
            <div className="auth-alert auth-alert-error">
              <span>⚠️</span> {serverError}
            </div>
          )}
          
          {/* GitHub Auth Section */}
          <GitHubLoginButton />
          
          <div style={{ textAlign: 'center', margin: '16px 0', color: 'var(--color-text-tertiary)', fontSize: '0.85rem' }}>
            OR CONTINUE WITH EMAIL
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">Email <span className="asterisk">*</span></label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@xyz.com"
                autoComplete="email"
                autoFocus
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password <span className="asterisk">*</span></label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-loading">
                  <span className="btn-spinner" /> Continuing...
                </span>
              ) : (
                <>Continue <span style={{ marginLeft: '4px' }}>→</span></>
              )}
            </button>

            <button type="button" className="btn-passkey" onClick={() => navigate('/register')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              Sign Up
            </button>
          </form>

          <div className="auth-credit">
            Developed by <span className="credit-name">ARNOB</span>
          </div>
        </div>

      </div>
    </div>
  );
}
