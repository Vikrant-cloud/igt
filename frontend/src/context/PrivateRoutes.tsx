import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace />;
}
// This component checks if the user is authenticated.
// If the user is authenticated, it renders the children components.
// If not, it redirects to the login page.