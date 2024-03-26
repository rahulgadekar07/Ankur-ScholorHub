// utils/auth.js

export const decodeToken = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  