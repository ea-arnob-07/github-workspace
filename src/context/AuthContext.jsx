import { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ---- Context ----
const AuthContext = createContext(null);

/**
 * AuthProvider — Fake authentication system using localStorage.
 * Stores registered users and current session.
 */
export function AuthProvider({ children }) {
  // All registered users stored in localStorage
  const [users, setUsers] = useLocalStorage('gw-users', []);
  // Current logged-in user
  const [currentUser, setCurrentUser, removeCurrentUser] = useLocalStorage('gw-current-user', null);

  /**
   * Register a new user.
   * @param {{ username: string, email: string, password: string }} userData
   * @returns {{ success: boolean, message: string }}
   */
  const register = useCallback(
    ({ username, email, password }) => {
      // Check if email already exists
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (existingUser) {
        return { success: false, message: 'An account with this email already exists' };
      }

      // Check if username already exists
      const existingUsername = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );
      if (existingUsername) {
        return { success: false, message: 'This username is already taken' };
      }

      // Create the new user
      const newUser = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password, // In a real app, this would be hashed
        createdAt: new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}`,
      };

      setUsers((prev) => [...prev, newUser]);

      // Auto-login after registration
      const { password: _, ...userWithoutPassword } = newUser;
      setCurrentUser(userWithoutPassword);

      return { success: true, message: 'Account created successfully!' };
    },
    [users, setUsers, setCurrentUser]
  );

  /**
   * Login with email and password.
   * @param {{ email: string, password: string }} credentials
   * @returns {{ success: boolean, message: string }}
   */
  const login = useCallback(
    ({ email, password }) => {
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (!user) {
        return { success: false, message: 'Invalid email or password' };
      }

      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);

      return { success: true, message: 'Logged in successfully!' };
    },
    [users, setCurrentUser]
  );

  /**
   * Logout the current user.
   */
  const logout = useCallback(() => {
    removeCurrentUser();
  }, [removeCurrentUser]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user: currentUser,
      isAuthenticated: !!currentUser,
      login,
      register,
      logout,
    }),
    [currentUser, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context.
 * @returns {{ user: Object, isAuthenticated: boolean, login: Function, register: Function, logout: Function }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
