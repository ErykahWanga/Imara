import axios from 'axios';
import { storage } from '../utils/storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = storage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      storage.remove('token');
      storage.remove('imara_current_user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject(message);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updateSettings: (data) => api.put('/auth/settings', data),
  getAnonymousName: () => api.get('/auth/anonymous-name'),
};

// Check-in API
export const checkInAPI = {
  create: (data) => api.post('/checkins', data),
  getToday: () => api.get('/checkins/today'),
  getAll: (params) => api.get('/checkins', { params }),
  getStats: () => api.get('/checkins/stats'),
  getCalendar: (year, month) => api.get('/checkins/calendar', { params: { year, month } }),
};

// Journal API
export const journalAPI = {
  create: (data) => api.post('/journal', data),
  getAll: (params) => api.get('/journal', { params }),
  getOne: (id) => api.get(`/journal/${id}`),
  update: (id, data) => api.put(`/journal/${id}`, data),
  delete: (id) => api.delete(`/journal/${id}`),
  getStats: () => api.get('/journal/stats'),
  getPrompts: () => api.get('/journal/prompts'),
};

// Habit API
export const habitAPI = {
  create: (data) => api.post('/habits', data),
  getAll: () => api.get('/habits'),
  getOne: (id) => api.get(`/habits/${id}`),
  update: (id, data) => api.put(`/habits/${id}`, data),
  delete: (id) => api.delete(`/habits/${id}`),
  toggleCompletion: (id, date) => api.post(`/habits/${id}/complete`, { date }),
  getStats: () => api.get('/habits/stats'),
};

// Mood API
export const moodAPI = {
  create: (data) => api.post('/mood', data),
  getAll: (params) => api.get('/mood', { params }),
  getStats: () => api.get('/mood/stats'),
  getCalendar: (year, month) => api.get('/mood/calendar', { params: { year, month } }),
};

// Achievement API
export const achievementAPI = {
  getAll: () => api.get('/achievements'),
  getUserAchievements: () => api.get('/achievements/user'),
  unlock: (id) => api.post(`/achievements/${id}/unlock`),
};

// Self-care API
export const selfCareAPI = {
  create: (data) => api.post('/selfcare', data),
  getAll: () => api.get('/selfcare'),
  update: (id, data) => api.put(`/selfcare/${id}`, data),
  delete: (id) => api.delete(`/selfcare/${id}`),
  toggleCompletion: (id, data) => api.post(`/selfcare/${id}/complete`, data),
};

// Challenge API
export const challengeAPI = {
  getAll: () => api.get('/challenges'),
  getOne: (id) => api.get(`/challenges/${id}`),
  join: (id) => api.post(`/challenges/${id}/join`),
  leave: (id) => api.delete(`/challenges/${id}/join`),
  getProgress: (id) => api.get(`/challenges/${id}/progress`),
};

// Reminder API
export const reminderAPI = {
  create: (data) => api.post('/reminders', data),
  getAll: () => api.get('/reminders'),
  update: (id, data) => api.put(`/reminders/${id}`, data),
  delete: (id) => api.delete(`/reminders/${id}`),
};

// Theme API
export const themeAPI = {
  get: () => api.get('/theme'),
  update: (data) => api.put('/theme', data),
};

// Community API
export const communityAPI = {
  createPost: (data) => api.post('/community/posts', data),
  getPosts: (params) => api.get('/community/posts', { params }),
  getPost: (id) => api.get(`/community/posts/${id}`),
  likePost: (id) => api.post(`/community/posts/${id}/like`),
  createReply: (postId, data) => api.post(`/community/posts/${postId}/replies`, data),
  getReplies: (postId) => api.get(`/community/posts/${postId}/replies`),
};

// Export all APIs
export default {
  auth: authAPI,
  checkIn: checkInAPI,
  journal: journalAPI,
  habit: habitAPI,
  mood: moodAPI,
  achievement: achievementAPI,
  selfCare: selfCareAPI,
  challenge: challengeAPI,
  reminder: reminderAPI,
  theme: themeAPI,
  community: communityAPI,
};