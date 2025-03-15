// Protected Route Component
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setIsEmailVerified(user.emailVerified);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Show a loading indicator while checking authentication status
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect based on authentication and verification status
  if (isAuthenticated && isEmailVerified) {
    return <Component />;
  } else if (isAuthenticated && !isEmailVerified) {
    return <Navigate to="/verification" />;
  } else {
    return <Navigate to="/signin" />;
  }
};

export default ProtectedRoute;
