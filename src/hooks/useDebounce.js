import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing a value.
 * Returns a debounced version of the input value that only updates
 * after the specified delay has passed without changes.
 *
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default 400ms)
 * @returns {*} The debounced value
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the timer if value changes before delay completes
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
