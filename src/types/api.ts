// SPTrans API Types
export interface BusLine {
  cl: number; // Line code
  lc: boolean; // Is circular
  lt: number; // Line type
  sl: number; // Service level
  tp: string; // Line description/name
  ts: string; // Main terminal
}

export interface BusPosition {
  a: boolean; // Accessible
  lat: number; // Latitude
  lng: number; // Longitude
  p: number; // Bus prefix
  ta: string; // Timestamp
}

export interface BusStop {
  cp: number; // Stop code
  np: string; // Stop name
  py: number; // Latitude
  px: number; // Longitude
  ed: string; // Address
}

export interface BusPrediction {
  cp: number; // Stop code
  np: string; // Stop name
  py: number; // Latitude
  px: number; // Longitude
  vs: {
    cl: number; // Line code
    sl: number; // Service level
    lt0: string; // Line destination 1
    lt1: string; // Line destination 2
    qv: number; // Number of vehicles
    vs: string; // Accessibility info
    t: string; // Arrival time
    a: boolean; // Accessible
    ta: string; // Timestamp
  }[];
}

// API Response wrappers
export interface SPTransResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface SearchBusLinesResponse {
  lines: BusLine[];
}

export interface BusPositionsResponse {
  positions: BusPosition[];
}

export interface NearbyStopsResponse {
  stops: BusStop[];
}

export interface BusPredictionsResponse {
  predictions: BusPrediction;
}