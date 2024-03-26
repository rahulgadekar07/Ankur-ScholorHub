// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = () => {
    // Logic to set isAuthenticated to true upon successful sign-in
    setIsAuthenticated(true);
  };

  const signOut = () => {
    // Logic to set isAuthenticated to false upon sign-out
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
