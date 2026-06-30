import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A drop-in replacement for `useLocation` that automatically persists
 * `location.state` to sessionStorage.
 * 
 * If the user refreshes the page, React Router drops the state. This hook
 * recovers the last known state for the current path from sessionStorage,
 * preventing silent crashes in multi-step booking flows.
 */
export const usePersistedLocation = () => {
  const location = useLocation();

  const persistedState = useMemo(() => {
    const storageKey = `route_state_${location.pathname}`;
    
    // If we have fresh state from the router, save it and use it.
    if (location.state) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(location.state));
      } catch (e) {
        console.warn('Failed to save location state to sessionStorage', e);
      }
      return location.state;
    }

    // If we don't have state (e.g. page refresh), try to recover it.
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to read location state from sessionStorage', e);
    }

    return null;
  }, [location.state, location.pathname]);

  return {
    ...location,
    state: persistedState,
  };
};
