import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getAuthUser, logoutGitHub } from '../services/githubAuthApi';

// ---- Context ----
const AuthContext = createContext(null);

/**
 * AuthProvider — Handles both fake auth and real GitHub auth.
 */
export function AuthProvider({ children }) {
  // All registered users stored in localStorage (fake auth)
  const [users, setUsers] = useLocalStorage('gw-users', []);
  // Current logged-in fake user
  const [currentUser, setCurrentUser, removeCurrentUser] = useLocalStorage('gw-current-user', null);
  
  // Real GitHub authenticated user
  const [githubUser, setGithubUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Check backend for an active GitHub session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getAuthUser();
        setGithubUser(user);
      } catch (err) {
        setGithubUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  /**
   * Register a new fake user.
   */
  const register = useCallback(
    ({ username, email, password }) => {
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (existingUser) return { success: false, message: 'An account with this email already exists' };

      const existingUsername = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );
      if (existingUsername) return { success: false, message: 'This username is already taken' };

      const newUser = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        createdAt: new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}`,
      };

      setUsers((prev) => [...prev, newUser]);
      const { password: _, ...userWithoutPassword } = newUser;
      setCurrentUser(userWithoutPassword);
      return { success: true, message: 'Account created successfully!' };
    },
    [users, setUsers, setCurrentUser]
  );

  /**
   * Login with email and password (fake auth).
   */
  const login = useCallback(
    ({ email, password }) => {
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );
      if (!user) return { success: false, message: 'Invalid email or password' };

      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      return { success: true, message: 'Logged in successfully!' };
    },
    [users, setCurrentUser]
  );

  /**
   * Logout the current user (handles both fake and real auth).
   */
  const logout = useCallback(async () => {
    if (githubUser) {
      try {
        await logoutGitHub();
        setGithubUser(null);
      } catch (err) {
        console.error('Logout error', err);
      }
    }
    removeCurrentUser();
  }, [githubUser, removeCurrentUser]);

  // Determine active user (GitHub takes priority over fake user)
  const activeUser = githubUser ? {
    id: githubUser.id,
    username: githubUser.login,
    name: githubUser.name || githubUser.login,
    email: githubUser.email,
    avatar: githubUser.avatar_url,
    isGithub: true, // Flag to identify real GitHub users
    originalData: githubUser
  } : currentUser ? {
    ...currentUser,
    isGithub: false
  } : null;

  const value = useMemo(
    () => ({
      user: activeUser,
      isAuthenticated: !!activeUser,
      isGithubAuth: !!githubUser,
      githubUser, // Raw github user data
      isAuthLoading,
      login,
      register,
      logout,
    }),
    [activeUser, githubUser, isAuthLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
