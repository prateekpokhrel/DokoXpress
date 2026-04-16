import axios from 'axios';
import { readStoredSession } from '@/utils/token';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const session = readStoredSession();

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});
