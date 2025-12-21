export const storage = {
    get: (key) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch {
        return null;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Storage error:', e);
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Storage error:', e);
      }
    }
  };
  
  export const generateAnonymousId = () => {
    return 'anon_' + Math.random().toString(36).substr(2, 9);
  };
  
  export const getAnonymousName = () => {
    const adjectives = ['Calm', 'Quiet', 'Gentle', 'Steady', 'Brave', 'Kind', 'Wise', 'Patient'];
    const nouns = ['Oak', 'River', 'Mountain', 'Star', 'Cloud', 'Stone', 'Wind', 'Light'];
    return adjectives[Math.floor(Math.random() * adjectives.length)] + ' ' + 
           nouns[Math.floor(Math.random() * nouns.length)];
  };