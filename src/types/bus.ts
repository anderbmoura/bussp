import { BusLine, BusPosition, BusStop } from './api';

export interface ProcessedBusLine extends BusLine {
  id: string;
  name: string;
  description: string;
  isCircular: boolean;
  type: string;
  isFavorite?: boolean;
}

export interface ProcessedBusPosition extends BusPosition {
  id: string;
  busLine: string;
  isAccessible: boolean;
  lastUpdate: Date;
}

export interface ProcessedBusStop extends BusStop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number; // Distance from user in meters
}

export interface BusRoute {
  lineCode: number;
  lineName: string;
  direction: 'outbound' | 'return';
  stops: ProcessedBusStop[];
  shape?: {
    latitude: number;
    longitude: number;
  }[];
}

export interface FavoriteLine {
  id: string;
  lineCode: number;
  lineName: string;
  nickname?: string;
  addedAt: Date;
  notifications: boolean;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  type: 'line' | 'stop' | 'address';
  result?: ProcessedBusLine | ProcessedBusStop;
  searchedAt: Date;
}

export interface BusTrackingState {
  selectedLine: ProcessedBusLine | null;
  busPositions: ProcessedBusPosition[];
  isTracking: boolean;
  lastUpdate: Date | null;
}