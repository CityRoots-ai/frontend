import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface AgentResponse {
  sessionId: string;
  action: string;
  reply: string;
  data?: any;
}

export interface AgentRequest {
  message: string;
  uiContext?: {
    selectedParkId?: string | null;
  };
  sessionId?: string;
}

export const sendMessage = async (
  message: string,
  selectedParkId: string | null = null,
  sessionId?: string
): Promise<AgentResponse> => {
  try {
    const request: AgentRequest = {
      message,
      uiContext: {
        selectedParkId,
      },
      sessionId,
    };

    const response = await api.post('/api/agent', request);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message to backend');
  }
};

export const analyzeEnvironmentalImpact = async (
  geometry: any,
  landUseType: string = 'removed'
): Promise<any> => {
  try {
    const response = await api.post('/api/analyze', {
      geometry,
      landUseType,
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing environmental impact:', error);
    throw new Error('Failed to analyze environmental impact');
  }
};

export const calculateNDVI = async (geometry: any): Promise<any> => {
  try {
    const response = await api.post('/api/ndvi', {
      geometry,
    });
    return response.data;
  } catch (error) {
    console.error('Error calculating NDVI:', error);
    throw new Error('Failed to calculate NDVI');
  }
};

export const healthCheck = async (): Promise<{ status: string }> => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error('Backend health check failed');
  }
};

export default api;