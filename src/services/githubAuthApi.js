/**
 * githubAuthApi.js
 * Frontend wrapper for backend auth endpoints.
 */

const API_BASE = '/api/auth';

/**
 * Initiates GitHub OAuth login flow
 */
export const loginWithGitHub = () => {
  window.location.href = `${API_BASE}/github`;
};

/**
 * Gets the currently authenticated user from the backend session
 */
export const getAuthUser = async () => {
  const res = await fetch(`${API_BASE}/me`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Not authenticated');
  }
  return data.user;
};

/**
 * Logs out from the backend session
 */
export const logoutGitHub = async () => {
  const res = await fetch(`${API_BASE}/logout`, { method: 'POST' });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Logout failed');
  }
  return data;
};
