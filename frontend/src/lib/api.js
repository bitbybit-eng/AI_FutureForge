import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' }
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error.response?.data || error.message);
  }
);

// Health check
export const checkHealth = () => api.get('/health');

// Ollama status
export const getOllamaStatus = () => api.get('/ollama/status');

// Profile
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);

// Simulation
export const runSimulation = (data) => api.post('/simulate', data);
export const getSimHistory = () => api.get('/simulate/history');

// Battle
export const runBattle = (data) => api.post('/battle', data);
export const getBattleHistory = () => api.get('/battle/history');

// Gap Analysis
export const runGapAnalysis = (data) => api.post('/gap', data);

// Roadmap
export const generateRoadmap = (data) => api.post('/roadmap', data);
export const getRoadmapHistory = () => api.get('/roadmap/history');

// Mentor
export const sendMentorMessage = (data) => api.post('/mentor/chat', data);
export const saveChatSession = (data) => api.post('/mentor/session', data);
export const getChatSessions = () => api.get('/mentor/sessions');

// WebSocket for streaming
export function createMentorStream(onMessage, onError) {
  const ws = new WebSocket(`${WS_BASE}`);
  
  ws.onopen = () => console.log('WebSocket connected');
  ws.onerror = (e) => onError?.(e);
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      console.error('WS parse error:', e);
    }
  };
  ws.onclose = () => console.log('WebSocket closed');
  
  return ws;
}

export default api;
