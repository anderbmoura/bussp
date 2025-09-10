import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { spTransAPI } from '../services/api/olhoVivo';
import { ProcessedBusLine, ProcessedBusPosition, ProcessedBusStop } from '../types/bus';
import { BusLine, BusPosition, BusStop } from '../types/api';

// Query keys
export const BUS_QUERY_KEYS = {
  SEARCH_LINES: 'search-lines',
  LINE_POSITIONS: 'line-positions',
  NEARBY_STOPS: 'nearby-stops',
  STOP_PREDICTIONS: 'stop-predictions',
  LINE_ROUTE: 'line-route',
} as const;

/**
 * Process raw bus line data from API
 */
const processBusLine = (line: BusLine): ProcessedBusLine => ({
  id: `line-${line.cl}`,
  cl: line.cl,
  lc: line.lc,
  lt: line.lt,
  sl: line.sl,
  tp: line.tp,
  ts: line.ts,
  name: `${line.cl} - ${line.tp}`,
  description: line.tp,
  isCircular: line.lc,
  type: line.lt.toString(),
});

/**
 * Process raw bus position data from API
 */
const processBusPosition = (position: BusPosition, lineCode: string): ProcessedBusPosition => ({
  id: `pos-${position.p}-${position.ta}`,
  a: position.a,
  lat: position.lat,
  lng: position.lng,
  p: position.p,
  ta: position.ta,
  busLine: lineCode,
  isAccessible: position.a,
  lastUpdate: new Date(position.ta),
});

/**
 * Process raw bus stop data from API
 */
const processBusStop = (stop: BusStop): ProcessedBusStop => ({
  id: `stop-${stop.cp}`,
  cp: stop.cp,
  np: stop.np,
  py: stop.py,
  px: stop.px,
  ed: stop.ed,
  name: stop.np,
  address: stop.ed,
  latitude: stop.py,
  longitude: stop.px,
});

/**
 * Hook to search bus lines
 */
export const useSearchBusLines = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [BUS_QUERY_KEYS.SEARCH_LINES, query],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      const response = await spTransAPI.searchBusLines(query);
      return response.map(processBusLine);
    },
    enabled: enabled && query.trim().length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to get real-time bus positions
 */
export const useBusPositions = (lineCode: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [BUS_QUERY_KEYS.LINE_POSITIONS, lineCode],
    queryFn: async () => {
      const response = await spTransAPI.getBusPositions(lineCode);
      return response.vs?.map((pos: BusPosition) => 
        processBusPosition(pos, lineCode.toString())
      ) || [];
    },
    enabled: enabled && lineCode > 0,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
    retry: 3,
  });
};

/**
 * Hook to get nearby stops
 */
export const useNearbyStops = (
  latitude: number, 
  longitude: number, 
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [BUS_QUERY_KEYS.NEARBY_STOPS, latitude, longitude],
    queryFn: async () => {
      const response = await spTransAPI.getNearbyStops(latitude, longitude);
      return response.map(processBusStop);
    },
    enabled: enabled && latitude !== 0 && longitude !== 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

/**
 * Hook to get stop predictions
 */
export const useStopPredictions = (stopCode: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [BUS_QUERY_KEYS.STOP_PREDICTIONS, stopCode],
    queryFn: async () => {
      const response = await spTransAPI.getStopPredictions(stopCode);
      return response;
    },
    enabled: enabled && stopCode > 0,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refresh every minute
    retry: 2,
  });
};

/**
 * Hook to get line route details
 */
export const useLineRoute = (lineCode: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [BUS_QUERY_KEYS.LINE_ROUTE, lineCode],
    queryFn: async () => {
      const response = await spTransAPI.getLineRoute(lineCode);
      return response;
    },
    enabled: enabled && lineCode > 0,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 2,
  });
};

/**
 * Mutation to authenticate with SPTrans API
 */
export const useAuthenticate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => spTransAPI.authenticate(),
    onSuccess: () => {
      // Invalidate all bus-related queries on successful authentication
      queryClient.invalidateQueries({ queryKey: [BUS_QUERY_KEYS.SEARCH_LINES] });
      queryClient.invalidateQueries({ queryKey: [BUS_QUERY_KEYS.LINE_POSITIONS] });
      queryClient.invalidateQueries({ queryKey: [BUS_QUERY_KEYS.NEARBY_STOPS] });
    },
  });
};