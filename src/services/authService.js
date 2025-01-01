// src/services/authService.js
export const authService = {
    login: async (username, password) => {
      // Simulated authentication logic
      if (username === 'admin' && password === 'admin') {
        return {
          id: 'admin-123',
          username: 'admin',
          role: 'admin',
        };
      } else if (username === 'user' && password === 'user123') {
        return {
          id: 'user-123',
          username: 'user',
          role: 'user',
        };
      }
      throw new Error('Invalid credentials');
    }
  };