// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../Contexts/authContext';

const PrivateRoute = ({ element, ...props }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Route {...props} element={element} />
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default PrivateRoute;
