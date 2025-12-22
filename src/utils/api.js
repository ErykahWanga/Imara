// API utility for IMARA backend integration
const API_BASE_URL = 'http://localhost:5000/api';

// Store JWT token in localStorage
const getToken = () => localStorage.getItem('imara_token');
const setToken = (token) => localStorage.setItem('imara_token', token);
const removeToken = () => localStorage.removeItem('imara_token');

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }

  return data;
};

// Authentication API
export const authAPI = {
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      setToken(response.token);
    }
    
    return response;
  },
  
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      setToken(response.token);
    }
    
    return response;
  },
  
  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },
  
  updateProfile: async (userData) => {
    return await apiRequest('/auth/updatedetails', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  updatePassword: async (passwordData) => {
    return await apiRequest('/auth/updatepassword', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },
  
  logout: () => {
    removeToken();
  }
};

// Daily Check-ins API
export const checkinAPI = {
  create: async (checkinData) => {
    return await apiRequest('/checkins', {
      method: 'POST',
      body: JSON.stringify(checkinData),
    });
  },
  
  getAll: async () => {
    return await apiRequest('/checkins');
  },
  
  getStats: async () => {
    return await apiRequest('/checkins/stats');
  },
  
  update: async (id, checkinData) => {
    return await apiRequest(`/checkins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(checkinData),
    });
  },
  
  delete: async (id) => {
    return await apiRequest(`/checkins/${id}`, {
      method: 'DELETE',
    });
  }
};

// Journal API
export const journalAPI = {
  create: async (journalData) => {
    return await apiRequest('/journal', {
      method: 'POST',
      body: JSON.stringify(journalData),
    });
  },
  
  getAll: async () => {
    return await apiRequest('/journal');
  },
  
  getStats: async () => {
    return await apiRequest('/journal/stats');
  },
  
  update: async (id, journalData) => {
    return await apiRequest(`/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(journalData),
    });
  },
  
  delete: async (id) => {
    return await apiRequest(`/journal/${id}`, {
      method: 'DELETE',
    });
  }
};

// Habits API
export const habitsAPI = {
  create: async (habitData) => {
    return await apiRequest('/habits', {
      method: 'POST',
      body: JSON.stringify(habitData),
    });
  },
  
  getAll: async () => {
    return await apiRequest('/habits');
  },
  
  getStats: async () => {
    return await apiRequest('/habits/stats');
  },
  
  complete: async (id) => {
    return await apiRequest(`/habits/${id}/complete`, {
      method: 'POST',
    });
  },
  
  update: async (id, habitData) => {
    return await apiRequest(`/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(habitData),
    });
  },
  
  delete: async (id) => {
    return await apiRequest(`/habits/${id}`, {
      method: 'DELETE',
    });
  }
};

// Achievements API
export const achievementsAPI = {
  getAll: async () => {
    return await apiRequest('/achievements');
  },
  
  getUserAchievements: async () => {
    return await apiRequest('/achievements/user');
  },
  
  unlock: async (achievementId) => {
    return await apiRequest(`/achievements/${achievementId}/unlock`, {
      method: 'POST',
    });
  }
};

// Community API
export const communityAPI = {
  getPosts: async () => {
    return await apiRequest('/community/posts');
  },
  
  createPost: async (postData) => {
    return await apiRequest('/community/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },
  
  replyToPost: async (postId, replyData) => {
    return await apiRequest(`/community/posts/${postId}/replies`, {
      method: 'POST',
      body: JSON.stringify(replyData),
    });
  },
  
  likePost: async (postId) => {
    return await apiRequest(`/community/posts/${postId}/like`, {
      method: 'POST',
    });
  }
};

// Challenges API
export const challengesAPI = {
  getAll: async () => {
    return await apiRequest('/challenges');
  },
  
  getUserChallenges: async () => {
    return await apiRequest('/challenges/user');
  },
  
  join: async (challengeId) => {
    return await apiRequest(`/challenges/${challengeId}/join`, {
      method: 'POST',
    });
  },
  
  leave: async (challengeId) => {
    return await apiRequest(`/challenges/${challengeId}/leave`, {
      method: 'POST',
    });
  },
  
  updateProgress: async (challengeId, progressData) => {
    return await apiRequest(`/challenges/${challengeId}/progress`, {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });
  }
};

// Reminders API
export const remindersAPI = {
  create: async (reminderData) => {
    return await apiRequest('/reminders', {
      method: 'POST',
      body: JSON.stringify(reminderData),
    });
  },
  
  getAll: async () => {
    return await apiRequest('/reminders');
  },
  
  update: async (id, reminderData) => {
    return await apiRequest(`/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reminderData),
    });
  },
  
  delete: async (id) => {
    return await apiRequest(`/reminders/${id}`, {
      method: 'DELETE',
    });
  }
};

// Theme API
export const themeAPI = {
  save: async (themeData) => {
    return await apiRequest('/themes', {
      method: 'POST',
      body: JSON.stringify(themeData),
    });
  },
  
  get: async () => {
    return await apiRequest('/themes');
  }
};

// Self-Care API
export const selfcareAPI = {
  createActivity: async (activityData) => {
    return await apiRequest('/selfcare/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  },
  
  getActivities: async () => {
    return await apiRequest('/selfcare/activities');
  },
  
  updateActivity: async (id, activityData) => {
    return await apiRequest(`/selfcare/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(activityData),
    });
  },
  
  deleteActivity: async (id) => {
    return await apiRequest(`/selfcare/activities/${id}`, {
      method: 'DELETE',
    });
  }
};

export default {
  authAPI,
  checkinAPI,
  journalAPI,
  habitsAPI,
  achievementsAPI,
  communityAPI,
  challengesAPI,
  remindersAPI,
  themeAPI,
  selfcareAPI
};