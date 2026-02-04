import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

/**
 * ProtectedRoute component that redirects unauthenticated users to login
 * and optionally restricts access based on user role
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role || localStorage.getItem('userRole');
    
    if (!allowedRoles.includes(userRole)) {
      // User doesn't have required role - redirect to their dashboard
      if (userRole === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (userRole === 'mover') {
        return <Navigate to="/mover/dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;

