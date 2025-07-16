import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    return !user ? children : <Navigate to="/" replace />;
}
// This component checks if the user is authenticated.
// If the user is not authenticated, it renders the children components.    