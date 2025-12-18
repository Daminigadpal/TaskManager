import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Show a loading spinner or null while checking auth state
    return <div>Loading...</div>;
  }
  
  // Check if user is logged in and has the required role if needed
  if (!user || !user.loggedIn) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }
  
  return children;
};

export default ProtectedRoute;