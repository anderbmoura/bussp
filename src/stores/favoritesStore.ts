import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteLine } from '../types/bus';
import { generateId } from '../utils/helpers';

interface FavoritesStore {
  favorites: FavoriteLine[];
  
  // Actions
  addFavorite: (lineCode: number, lineName: string, nickname?: string) => void;
  removeFavorite: (favoriteId: string) => void;
  updateFavorite: (favoriteId: string, updates: Partial<FavoriteLine>) => void;
  toggleNotifications: (favoriteId: string) => void;
  isFavorite: (lineCode: number) => boolean;
  getFavoriteByLineCode: (lineCode: number) => FavoriteLine | undefined;
  clearAllFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (lineCode: number, lineName: string, nickname?: string) => {
        const { favorites } = get();
        
        // Check if already exists
        const existing = favorites.find(fav => fav.lineCode === lineCode);
        if (existing) {
          return;
        }

        const newFavorite: FavoriteLine = {
          id: generateId(),
          lineCode,
          lineName,
          nickname,
          addedAt: new Date(),
          notifications: true,
        };

        set({ favorites: [...favorites, newFavorite] });
      },

      removeFavorite: (favoriteId: string) => {
        const { favorites } = get();
        set({ 
          favorites: favorites.filter(fav => fav.id !== favoriteId) 
        });
      },

      updateFavorite: (favoriteId: string, updates: Partial<FavoriteLine>) => {
        const { favorites } = get();
        set({
          favorites: favorites.map(fav =>
            fav.id === favoriteId ? { ...fav, ...updates } : fav
          ),
        });
      },

      toggleNotifications: (favoriteId: string) => {
        const { favorites } = get();
        set({
          favorites: favorites.map(fav =>
            fav.id === favoriteId 
              ? { ...fav, notifications: !fav.notifications }
              : fav
          ),
        });
      },

      isFavorite: (lineCode: number) => {
        const { favorites } = get();
        return favorites.some(fav => fav.lineCode === lineCode);
      },

      getFavoriteByLineCode: (lineCode: number) => {
        const { favorites } = get();
        return favorites.find(fav => fav.lineCode === lineCode);
      },

      clearAllFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'bussp-favorites',
      storage: createJSONStorage(() => AsyncStorage),
      // Custom serialization to handle Date objects
      serialize: (state) => {
        return JSON.stringify({
          ...state,
          state: {
            ...state.state,
            favorites: state.state.favorites.map(fav => ({
              ...fav,
              addedAt: fav.addedAt.toISOString(),
            })),
          },
        });
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          ...parsed,
          state: {
            ...parsed.state,
            favorites: parsed.state.favorites.map((fav: any) => ({
              ...fav,
              addedAt: new Date(fav.addedAt),
            })),
          },
        };
      },
    }
  )
);