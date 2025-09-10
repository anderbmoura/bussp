export const SPTRANS_ENDPOINTS = {
  // Authentication
  AUTHENTICATE: '/Login/Autenticar',
  
  // Lines
  SEARCH_LINES: '/Linha/Buscar',
  LINE_DETAILS: '/Linha/CarregarDetalhes',
  
  // Positions
  LINE_POSITIONS: '/Posicao/Linha',
  ALL_POSITIONS: '/Posicao',
  
  // Stops
  SEARCH_STOPS: '/Parada/Buscar',
  NEARBY_STOPS: '/Parada/BuscarParadasProximas',
  STOP_BY_LINE: '/Parada/BuscarParadasPorLinha',
  STOP_BY_CORRIDOR: '/Parada/BuscarParadasPorCorredor',
  
  // Predictions
  STOP_PREDICTIONS: '/Previsao/Parada',
  LINE_PREDICTIONS: '/Previsao/Linha',
  
  // Corridors
  SEARCH_CORRIDORS: '/Corredor/Buscar',
  
  // General
  COMPANIES: '/Empresa',
} as const;

export const API_RESPONSE_STATUS = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  SERVER_ERROR: 500,
} as const;

export const REQUEST_TIMEOUTS = {
  AUTHENTICATION: 10000,
  SEARCH: 15000,
  POSITIONS: 30000,
  PREDICTIONS: 10000,
} as const;