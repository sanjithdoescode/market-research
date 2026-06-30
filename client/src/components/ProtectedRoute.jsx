import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="bg-orbs" aria-hidden="true">
          <div className="bg-orb bg-orb--1" />
          <div className="bg-orb bg-orb--2" />
        </div>
        <div className="auth-loading-content">
          <div className="auth-spinner" />
          <p>Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
