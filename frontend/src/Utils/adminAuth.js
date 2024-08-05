// utils/adminAuth.js

export const decodeAdminToken = (token) => {
    try {
      if (!token) {
        console.error('Token is null or undefined');
        return null;
      }
      const decodedAdminToken = JSON.parse(atob(token.split('.')[1]));
      return decodedAdminToken;
    } catch (error) {
      console.error('Error decoding admin token:', error);
      return null;
    }
  };
  