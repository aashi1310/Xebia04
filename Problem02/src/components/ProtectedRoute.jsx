import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/storage';

/**
 * ProtectedRoute – redirects unauthenticated users to /login.
 */
export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: '/dashboard' }} />;
  }
  return children;
}
