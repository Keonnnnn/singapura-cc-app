import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "./contexts/UserContext";
import ProtectedLayout from "./components/ProtectedLayout";

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return (
    <ProtectedLayout>
      <Component {...rest} />
    </ProtectedLayout>
  );
};

export default ProtectedRoute;
