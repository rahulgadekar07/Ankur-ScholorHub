import React, { createContext, useState, useContext } from 'react';
import { decodeToken } from '../Utils/auth'; // Import the decodeToken function

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const signIn = (token) => {
    // Save token to localStorage or state
    localStorage.setItem('authToken', token);
    // Decode the token to extract user info
    const decoded = decodeToken(token);
    if (decoded) {
      setIsAuthenticated(true);
      setUser(decoded);
    }
  };

  const signOut = () => {
    // Clear token from localStorage or state
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
