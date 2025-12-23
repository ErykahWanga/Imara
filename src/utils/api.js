import { storage } from './storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class API {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const token = storage.get('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized (token expired)
      if (response.status === 401) {
        storage.remove('token');
        storage.remove('imara_current_user');
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updateSettings(settings) {
    return this.request('/auth/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Check-in endpoints
  async createCheckIn(data) {
    return this.request('/checkins', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTodayCheckIn() {
    return this.request('/checkins/today');
  }

  async getCheckIns(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/checkins${queryString ? `?${queryString}` : ''}`);
  }

  async getCheckInStats() {
    return this.request('/checkins/stats');
  }

  async getCheckInCalendar(year, month) {
    return this.request(`/checkins/calendar?year=${year}&month=${month}`);
  }

  // Journal endpoints
  async createJournalEntry(data) {
    return this.request('/journal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getJournalEntries(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/journal${queryString ? `?${queryString}` : ''}`);
  }

  async getJournalEntry(id) {
    return this.request(`/journal/${id}`);
  }

  async updateJournalEntry(id, data) {
    return this.request(`/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJournalEntry(id) {
    return this.request(`/journal/${id}`, {
      method: 'DELETE',
    });
  }

  async getJournalStats() {
    return this.request('/journal/stats');
  }

  async getJournalPrompts() {
    return this.request('/journal/prompts');
  }

  // Habit endpoints
  async createHabit(data) {
    return this.request('/habits', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getHabits() {
    return this.request('/habits');
  }

  async getHabit(id) {
    return this.request(`/habits/${id}`);
  }

  async updateHabit(id, data) {
    return this.request(`/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteHabit(id) {
    return this.request(`/habits/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleHabitCompletion(id, date) {
    return this.request(`/habits/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ date }),
    });
  }

  async getHabitStats() {
    return this.request('/habits/stats');
  }

  // Mood endpoints
  async createMoodEntry(data) {
    return this.request('/mood', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMoodEntries(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/mood${queryString ? `?${queryString}` : ''}`);
  }

  async getMoodStats() {
    return this.request('/mood/stats');
  }

  // Achievement endpoints
  async getAchievements() {
    return this.request('/achievements');
  }

  async getUserAchievements() {
    return this.request('/achievements/user');
  }

  // Self-care endpoints
  async createSelfCareActivity(data) {
    return this.request('/selfcare', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSelfCareActivities() {
    return this.request('/selfcare');
  }

  async updateSelfCareActivity(id, data) {
    return this.request(`/selfcare/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async toggleSelfCareCompletion(id, date, completed) {
    return this.request(`/selfcare/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ date, completed }),
    });
  }

  // Challenge endpoints
  async getChallenges() {
    return this.request('/challenges');
  }

  async joinChallenge(challengeId) {
    return this.request(`/challenges/${challengeId}/join`, {
      method: 'POST',
    });
  }

  async getChallengeProgress(challengeId) {
    return this.request(`/challenges/${challengeId}/progress`);
  }

  // Reminder endpoints
  async createReminder(data) {
    return this.request('/reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getReminders() {
    return this.request('/reminders');
  }

  async updateReminder(id, data) {
    return this.request(`/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReminder(id) {
    return this.request(`/reminders/${id}`, {
      method: 'DELETE',
    });
  }

  // Theme endpoints
  async getTheme() {
    return this.request('/theme');
  }

  async updateTheme(data) {
    return this.request('/theme', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Community endpoints
  async createCommunityPost(data) {
    return this.request('/community/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCommunityPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/community/posts${queryString ? `?${queryString}` : ''}`);
  }

  async likePost(postId) {
    return this.request(`/community/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async createPostReply(postId, data) {
    return this.request(`/community/posts/${postId}/replies`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPostReplies(postId) {
    return this.request(`/community/posts/${postId}/replies`);
  }
}

export const api = new API();