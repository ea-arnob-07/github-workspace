import { useState, useCallback } from 'react';

/**
 * Custom hook for syncing state with localStorage.
 * Reads initial value from localStorage, and writes updates back.
 *
 * @param {string} key - The localStorage key
 * @param {*} initialValue - Default value if key doesn't exist
 * @returns {[*, Function, Function]} [storedValue, setValue, removeValue]
 */
export function useLocalStorage(key, initialValue) {
  // Lazy initialization — read from localStorage only once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Wrapped setter that writes to both state and localStorage
  const setValue = useCallback(
    (value) => {
      try {
        // Allow functional updates like useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove the key from localStorage entirely
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
