import { endpoints } from '../config/api';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  console.log(`Making request to: ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 503) {
      console.error('Backend service is starting up...');
    }
    return Promise.reject(error);
  }
);

export async function uploadImage(file: File, gridSize: number) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('grid_size', gridSize.toString());

  try {
    const response = await fetch(endpoints.convertImage, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function checkAPIHealth() {
  try {
    const response = await fetch(endpoints.healthCheck);
    return response.ok;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
}

export async function checkBackendHealth() {
  try {
    const response = await api.get('/api/health');
    return response.data.status === 'healthy';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}