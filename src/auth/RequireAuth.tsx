import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { ScreenLoader } from '@/components/loaders';

import { useAuthContext } from './useAuthContext';

const RequireAuth = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <ScreenLoader />;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export { RequireAuth };
