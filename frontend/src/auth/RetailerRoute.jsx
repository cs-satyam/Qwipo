import React from 'react';
import { Navigate } from 'react-router-dom';

const RetailerRoute = ({ children }) => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');
  const role = (() => {
    try { return userRaw ? JSON.parse(userRaw).role : undefined; } catch { return undefined; }
  })();

  if (!token) return <Navigate to="/login" replace />;
  if (role !== 'retailer') return <Navigate to="/mymarket" replace />;
  return children;
};

export default RetailerRoute;
