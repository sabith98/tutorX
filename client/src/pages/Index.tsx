
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux';

// This file redirects to Home if logged in, or Login if not logged in
const Index = () => {
  const { user, isLoading } = useAppSelector(state => state.auth);

  useEffect(() => {
    console.log('Index page loaded, checking authentication...', { user, isLoading });
  }, [user, isLoading]);

  if (isLoading) {
    console.log('Auth is loading, showing loading indicator');
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user) {
    console.log('User is authenticated, redirecting to Home:', user);
    return <Navigate to="/" replace />;
  }

  console.log('User is not authenticated, redirecting to Login');
  return <Navigate to="/login" replace />;
};

export default Index;