// AdminAuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const adminSignIn = () => {
    // Logic to set isAdminAuthenticated to true upon successful admin sign-in
    setIsAdminAuthenticated(true);
  };

  const adminSignOut = () => {
    // Logic to set isAdminAuthenticated to false upon admin sign-out
    setIsAdminAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, adminSignIn, adminSignOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
