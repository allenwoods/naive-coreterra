import axios from 'axios';
import type { User, Task, Project, ShopItem, Achievement } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/api/auth/login', { username, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async (status?: string) => {
    const params = status ? { status } : {};
    const response = await api.get<Task[]>('/api/tasks', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<Task>(`/api/tasks/${id}`);
    return response.data;
  },
  create: async (task: Partial<Task>) => {
    const response = await api.post<Task>('/api/tasks', task);
    return response.data;
  },
  update: async (id: number, updates: Partial<Task>) => {
    const response = await api.put<Task>(`/api/tasks/${id}`, updates);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/api/tasks/${id}`);
  },
  complete: async (id: number) => {
    const response = await api.post<Task>(`/api/tasks/${id}/complete`);
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await api.get<Project[]>('/api/projects');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Project>(`/api/projects/${id}`);
    return response.data;
  },
  create: async (project: Partial<Project>) => {
    const response = await api.post<Project>('/api/projects', project);
    return response.data;
  },
  update: async (id: string, updates: Partial<Project>) => {
    const response = await api.put<Project>(`/api/projects/${id}`, updates);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/api/projects/${id}`);
  },
};

// Users API
export const usersAPI = {
  getMe: async () => {
    const response = await api.get<User>('/api/users/me');
    return response.data;
  },
  updateMe: async (updates: Partial<User>) => {
    const response = await api.put<User>('/api/users/me', updates);
    return response.data;
  },
};

// Gamification API
export const gamificationAPI = {
  getShopItems: async () => {
    const response = await api.get<ShopItem[]>('/api/gamification/shop');
    return response.data;
  },
  buyItem: async (itemId: string) => {
    const response = await api.post(`/api/gamification/shop/${itemId}/buy`);
    return response.data;
  },
  getAchievements: async () => {
    const response = await api.get<Achievement[]>('/api/gamification/achievements');
    return response.data;
  },
};

export default api;

