/**
 * Form validation utilities for the authentication system.
 */

/**
 * Validate an email address format.
 * @param {string} email
 * @returns {string|null} Error message or null if valid
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
}

/**
 * Validate a password.
 * @param {string} password
 * @returns {string|null} Error message or null if valid
 */
export function validatePassword(password) {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
}

/**
 * Validate a username.
 * @param {string} username
 * @returns {string|null} Error message or null if valid
 */
export function validateUsername(username) {
  if (!username || !username.trim()) {
    return 'Username is required';
  }
  if (username.trim().length < 3) {
    return 'Username must be at least 3 characters';
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) {
    return 'Username can only contain letters, numbers, hyphens, and underscores';
  }
  return null;
}

/**
 * Validate a full registration form.
 * @param {{ username: string, email: string, password: string, confirmPassword: string }} values
 * @returns {Object} An object with field names as keys and error messages as values
 */
export function validateRegistration(values) {
  const errors = {};

  const usernameError = validateUsername(values.username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}

/**
 * Validate a login form.
 * @param {{ email: string, password: string }} values
 * @returns {Object} An object with field names as keys and error messages as values
 */
export function validateLogin(values) {
  const errors = {};

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  return errors;
}
