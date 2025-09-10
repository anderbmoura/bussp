import { SPTRANS_API_CONFIG } from '../../utils/constants';

class SPTransAPI {
  private baseURL: string;
  private apiKey: string;
  private isAuthenticated: boolean = false;

  constructor() {
    this.baseURL = SPTRANS_API_CONFIG.BASE_URL;
    this.apiKey = SPTRANS_API_CONFIG.API_KEY;
  }

  /**
   * Authenticate with SPTrans API
   */
  async authenticate(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseURL}/Login/Autenticar?token=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      this.isAuthenticated = response.ok;
      return this.isAuthenticated;
    } catch (error) {
      console.error('SPTrans authentication failed:', error);
      this.isAuthenticated = false;
      return false;
    }
  }

  /**
   * Ensure authentication before API calls
   */
  private async ensureAuthenticated(): Promise<void> {
    if (!this.isAuthenticated) {
      const success = await this.authenticate();
      if (!success) {
        throw new Error('Failed to authenticate with SPTrans API');
      }
    }
  }

  /**
   * Search bus lines by name or code
   */
  async searchBusLines(query: string) {
    await this.ensureAuthenticated();
    
    try {
      const response = await fetch(
        `${this.baseURL}/Linha/Buscar?termosBusca=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching bus lines:', error);
      throw error;
    }
  }

  /**
   * Get real-time bus positions for a specific line
   */
  async getBusPositions(lineCode: number) {
    await this.ensureAuthenticated();
    
    try {
      const response = await fetch(
        `${this.baseURL}/Posicao/Linha?codigoLinha=${lineCode}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting bus positions:', error);
      throw error;
    }
  }

  /**
   * Search bus stops by name or location
   */
  async searchBusStops(query: string) {
    await this.ensureAuthenticated();
    
    try {
      const response = await fetch(
        `${this.baseURL}/Parada/Buscar?termosBusca=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching bus stops:', error);
      throw error;
    }
  }

  /**
   * Get bus stops by geographic coordinates
   */
  async getNearbyStops(latitude: number, longitude: number) {
    await this.ensureAuthenticated();
    
    try {
      const response = await fetch(
        `${this.baseURL}/Parada/BuscarParadasProximas?latitude=${latitude}&longitude=${longitude}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting nearby stops:', error);
      throw error;
    }
  }

  /**
   * Get arrival predictions for a specific stop
   */
  async getStopPredictions(stopCode: number) {
    await this.ensureAuthenticated();
    
    try {
      const response = await fetch(
        `${this.baseURL}/Previsao/Parada?codigoParada=${stopCode}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting stop predictions:', error);
      throw error;
    }
  }

  /**
   * Get arrival predictions for a specific line at a stop
   */
  async getLinePredictions(lineCode: number, stopCode: number) {
    await this.ensureAuthenticated();
    
    try {
      const response = await fetch(
        `${this.baseURL}/Previsao/Linha?codigoLinha=${lineCode}&codigoParada=${stopCode}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting line predictions:', error);
      throw error;
    }
  }

  /**
   * Get detailed route information for a line
   */
  async getLineRoute(lineCode: number) {
    await this.ensureAuthenticated();
    
    try {
      const response = await fetch(
        `${this.baseURL}/Linha/CarregarDetalhes?codigoLinha=${lineCode}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting line route:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const spTransAPI = new SPTransAPI();