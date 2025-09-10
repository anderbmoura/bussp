import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchHistoryItem, ProcessedBusLine, ProcessedBusStop } from '../types/bus';
import { generateId } from '../utils/helpers';
import { CACHE_CONFIG } from '../utils/constants';

interface SearchHistoryStore {
  history: SearchHistoryItem[];
  
  // Actions
  addToHistory: (
    query: string, 
    type: 'line' | 'stop' | 'address', 
    result?: ProcessedBusLine | ProcessedBusStop
  ) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  getRecentSearches: (limit?: number) => SearchHistoryItem[];
  getFrequentSearches: (limit?: number) => SearchHistoryItem[];
}

export const useSearchHistoryStore = create<SearchHistoryStore>()(
  persist(
    (set, get) => ({
      history: [],

      addToHistory: (
        query: string, 
        type: 'line' | 'stop' | 'address', 
        result?: ProcessedBusLine | ProcessedBusStop
      ) => {
        const { history } = get();
        
        // Check if query already exists
        const existingIndex = history.findIndex(
          item => item.query.toLowerCase() === query.toLowerCase() && item.type === type
        );

        const newItem: SearchHistoryItem = {
          id: generateId(),
          query: query.trim(),
          type,
          result,
          searchedAt: new Date(),
        };

        let updatedHistory: SearchHistoryItem[];

        if (existingIndex >= 0) {
          // Update existing item (move to top)
          updatedHistory = [
            newItem,
            ...history.filter((_, index) => index !== existingIndex)
          ];
        } else {
          // Add new item to top
          updatedHistory = [newItem, ...history];
        }

        // Limit history size
        if (updatedHistory.length > CACHE_CONFIG.MAX_HISTORY_ITEMS) {
          updatedHistory = updatedHistory.slice(0, CACHE_CONFIG.MAX_HISTORY_ITEMS);
        }

        set({ history: updatedHistory });
      },

      removeFromHistory: (id: string) => {
        const { history } = get();
        set({ 
          history: history.filter(item => item.id !== id) 
        });
      },

      clearHistory: () => {
        set({ history: [] });
      },

      getRecentSearches: (limit = 5) => {
        const { history } = get();
        return history
          .sort((a, b) => b.searchedAt.getTime() - a.searchedAt.getTime())
          .slice(0, limit);
      },

      getFrequentSearches: (limit = 5) => {
        const { history } = get();
        
        // Count frequency of each query
        const queryFrequency = history.reduce((acc, item) => {
          const key = `${item.query}-${item.type}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Get unique searches and sort by frequency
        const uniqueSearches = history.reduce((acc, item) => {
          const key = `${item.query}-${item.type}`;
          if (!acc[key]) {
            acc[key] = item;
          }
          return acc;
        }, {} as Record<string, SearchHistoryItem>);

        return Object.values(uniqueSearches)
          .sort((a, b) => {
            const freqA = queryFrequency[`${a.query}-${a.type}`];
            const freqB = queryFrequency[`${b.query}-${b.type}`];
            return freqB - freqA;
          })
          .slice(0, limit);
      },
    }),
    {
      name: 'bussp-search-history',
      storage: createJSONStorage(() => AsyncStorage),
      // Custom serialization to handle Date objects
      serialize: (state) => {
        return JSON.stringify({
          ...state,
          state: {
            ...state.state,
            history: state.state.history.map(item => ({
              ...item,
              searchedAt: item.searchedAt.toISOString(),
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
            history: parsed.state.history.map((item: any) => ({
              ...item,
              searchedAt: new Date(item.searchedAt),
            })),
          },
        };
      },
    }
  )
);