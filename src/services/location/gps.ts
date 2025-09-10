import * as Location from 'expo-location';
import { MAP_CONFIG } from '../../utils/constants';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationService {
  getCurrentLocation: () => Promise<LocationCoordinates>;
  watchLocation: (callback: (location: LocationCoordinates) => void) => Promise<() => void>;
  requestPermissions: () => Promise<boolean>;
  hasPermissions: () => Promise<boolean>;
}

class LocationServiceImpl implements LocationService {
  /**
   * Request location permissions from the user
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  /**
   * Check if location permissions are granted
   */
  async hasPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking location permissions:', error);
      return false;
    }
  }

  /**
   * Get current location coordinates
   */
  async getCurrentLocation(): Promise<LocationCoordinates> {
    try {
      const hasPermission = await this.hasPermissions();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) {
          throw new Error('Location permission denied');
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || undefined,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      
      // Fallback to São Paulo city center
      return {
        latitude: MAP_CONFIG.DEFAULT_REGION.latitude,
        longitude: MAP_CONFIG.DEFAULT_REGION.longitude,
      };
    }
  }

  /**
   * Watch location changes
   */
  async watchLocation(
    callback: (location: LocationCoordinates) => void
  ): Promise<() => void> {
    try {
      const hasPermission = await this.hasPermissions();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) {
          throw new Error('Location permission denied');
        }
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 50, // Update every 50 meters
        },
        (location) => {
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy || undefined,
          });
        }
      );

      return () => subscription.remove();
    } catch (error) {
      console.error('Error watching location:', error);
      
      // Return a no-op function if watching fails
      return () => {};
    }
  }

  /**
   * Check if location is within São Paulo bounds
   */
  isLocationInSaoPaulo(location: LocationCoordinates): boolean {
    const { latitude, longitude } = location;
    const { northeast, southwest } = MAP_CONFIG.SAO_PAULO_BOUNDS;

    return (
      latitude <= northeast.lat &&
      latitude >= southwest.lat &&
      longitude <= northeast.lng &&
      longitude >= southwest.lng
    );
  }

  /**
   * Calculate distance between two coordinates (in meters)
   */
  calculateDistance(
    from: LocationCoordinates,
    to: LocationCoordinates
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (from.latitude * Math.PI) / 180;
    const φ2 = (to.latitude * Math.PI) / 180;
    const Δφ = ((to.latitude - from.latitude) * Math.PI) / 180;
    const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}

// Export singleton instance
export const locationService = new LocationServiceImpl();