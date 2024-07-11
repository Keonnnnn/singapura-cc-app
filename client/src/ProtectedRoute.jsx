import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from './contexts/UserContext';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" />;
  }
  

  return <Component {...rest} />;
};

export default ProtectedRoute;
