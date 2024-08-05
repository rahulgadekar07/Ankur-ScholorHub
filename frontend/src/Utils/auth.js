// auth.js (path:-frontend\src\Utils\auth.js)

export const decodeToken = (token) => {
    try {
      if (!token) {
        console.error('Token is null or undefined');
        return null;
      }
  
      // Split the token into its components
      const tokenParts = token.split('.');
  
      // Ensure there are three parts (header, payload, signature)
      if (tokenParts.length !== 3) {
        console.error('Invalid token format');
        return null;
      }
  
      // Decode the payload (middle part)
      const decodedToken = JSON.parse(atob(tokenParts[1]));
      return decodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  