import { useState, useEffect, useCallback } from 'react';
import { locationService, LocationCoordinates } from '../services/location/gps';

interface UseLocationReturn {
  location: LocationCoordinates | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
  startWatching: () => Promise<void>;
  stopWatching: () => void;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [watchSubscription, setWatchSubscription] = useState<(() => void) | null>(null);

  // Check permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const granted = await locationService.hasPermissions();
        setHasPermission(granted);
      } catch (err) {
        console.error('Error checking location permissions:', err);
      }
    };

    checkPermissions();
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const granted = await locationService.requestPermissions();
      setHasPermission(granted);
      
      if (!granted) {
        setError('Permissão de localização negada');
      }
      
      return granted;
    } catch (err) {
      const errorMessage = 'Erro ao solicitar permissão de localização';
      setError(errorMessage);
      console.error(errorMessage, err);
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const currentLocation = await locationService.getCurrentLocation();
      setLocation(currentLocation);
    } catch (err) {
      const errorMessage = 'Erro ao obter localização atual';
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startWatching = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      
      // Stop existing watch if any
      if (watchSubscription) {
        watchSubscription();
        setWatchSubscription(null);
      }

      const unsubscribe = await locationService.watchLocation((newLocation) => {
        setLocation(newLocation);
      });
      
      setWatchSubscription(() => unsubscribe);
    } catch (err) {
      const errorMessage = 'Erro ao iniciar monitoramento de localização';
      setError(errorMessage);
      console.error(errorMessage, err);
    }
  }, [watchSubscription]);

  const stopWatching = useCallback((): void => {
    if (watchSubscription) {
      watchSubscription();
      setWatchSubscription(null);
    }
  }, [watchSubscription]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchSubscription) {
        watchSubscription();
      }
    };
  }, [watchSubscription]);

  return {
    location,
    isLoading,
    error,
    hasPermission,
    requestPermission,
    getCurrentLocation,
    startWatching,
    stopWatching,
  };
};