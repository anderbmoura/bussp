import { create } from 'zustand';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '../types/user';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
  
  // Biometric authentication
  enableBiometric: () => Promise<boolean>;
  authenticateWithBiometric: () => Promise<boolean>;
  
  // Session management
  checkAuthState: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement Firebase authentication
      // This is a placeholder implementation
      const user: User = {
        id: '1',
        email: credentials.email,
        name: 'User Name',
        preferences: {
          theme: 'system',
          notifications: {
            enabled: true,
            busArrivals: true,
            serviceAlerts: true,
            favoriteLines: true
          },
          biometricAuth: false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false, 
        error: null 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      });
    }
  },

  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement Firebase user registration
      const user: User = {
        id: '1',
        email: credentials.email,
        name: credentials.name,
        preferences: {
          theme: 'system',
          notifications: {
            enabled: true,
            busArrivals: true,
            serviceAlerts: true,
            favoriteLines: true
          },
          biometricAuth: false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false, 
        error: null 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    
    try {
      // TODO: Implement Firebase logout
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Logout failed' 
      });
    }
  },

  updateUser: (updates: Partial<User>) => {
    const { user } = get();
    if (user) {
      set({ 
        user: { 
          ...user, 
          ...updates, 
          updatedAt: new Date() 
        } 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  enableBiometric: async () => {
    try {
      // TODO: Implement biometric authentication setup
      const { user } = get();
      if (user) {
        const updatedUser = {
          ...user,
          preferences: {
            ...user.preferences,
            biometricAuth: true
          }
        };
        set({ user: updatedUser });
      }
      return true;
    } catch {
      return false;
    }
  },

  authenticateWithBiometric: async () => {
    try {
      // TODO: Implement biometric authentication
      return true;
    } catch {
      return false;
    }
  },

  checkAuthState: async () => {
    set({ isLoading: true });
    
    try {
      // TODO: Check Firebase auth state
      // For now, just clear loading state
      set({ isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Auth check failed' 
      });
    }
  },

  refreshToken: async () => {
    try {
      // TODO: Implement token refresh
      return Promise.resolve();
    } catch (error) {
      console.warn('Token refresh failed:', error);
      return Promise.reject(error);
    }
  }
}));