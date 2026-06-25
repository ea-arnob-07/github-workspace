import { createContext, useContext, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';

const SettingsContext = createContext(null);

// Default settings values
const DEFAULT_SETTINGS = {
  paginationSize: 20,
  defaultSearchType: 'users', // 'users' | 'repositories'
};

/**
 * SettingsProvider — Manages app-wide user preferences.
 * Theme, pagination size, and default search type.
 */
export function SettingsProvider({ children }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [settings, setSettings] = useLocalStorage('gw-settings', DEFAULT_SETTINGS);

  /**
   * Update a specific setting.
   * @param {string} key - The setting key
   * @param {*} value - The new value
   */
  const updateSetting = useCallback(
    (key, value) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [setSettings]
  );

  /**
   * Reset all settings to defaults.
   */
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setTheme('dark');
  }, [setSettings, setTheme]);

  const value = useMemo(
    () => ({
      // Theme
      theme,
      resolvedTheme,
      setTheme,
      // Settings
      paginationSize: settings.paginationSize,
      defaultSearchType: settings.defaultSearchType,
      updateSetting,
      resetSettings,
    }),
    [theme, resolvedTheme, setTheme, settings, updateSetting, resetSettings]
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

/**
 * Hook to access settings context.
 */
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
