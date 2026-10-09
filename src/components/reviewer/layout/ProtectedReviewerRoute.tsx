import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDemoAuth } from '../../../context/DemoAuthContext';

interface ProtectedReviewerRouteProps {
  children: React.ReactElement;
}

export const ProtectedReviewerRoute: React.FC<ProtectedReviewerRouteProps> = ({ children }) => {
  const { isAuthenticated } = useDemoAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};
