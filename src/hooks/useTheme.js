import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for theme management.
 * Supports 'dark', 'light', and 'system' modes.
 * Applies the theme to the document's data-theme attribute.
 *
 * @returns {{ theme: string, resolvedTheme: string, setTheme: Function }}
 */
export function useTheme() {
  const [theme, setThemeValue] = useLocalStorage('gw-theme', 'dark');

  // Resolve 'system' to actual theme based on OS preference
  const getResolvedTheme = useCallback(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return theme;
  }, [theme]);

  // Apply theme to DOM
  useEffect(() => {
    const resolved = getResolvedTheme();
    document.documentElement.setAttribute('data-theme', resolved);

    // Listen for system preference changes when in 'system' mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const newResolved = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newResolved);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, getResolvedTheme]);

  const setTheme = useCallback(
    (newTheme) => {
      if (['dark', 'light', 'system'].includes(newTheme)) {
        setThemeValue(newTheme);
      }
    },
    [setThemeValue]
  );

  return {
    theme,              // User's preference: 'dark' | 'light' | 'system'
    resolvedTheme: getResolvedTheme(), // Actual applied theme
    setTheme,
  };
}
