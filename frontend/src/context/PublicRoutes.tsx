import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const checkRoute = () => {
        if (user?.role === 'admin') {
            return '/admin/dashboard'
        } else if (user?.role === 'student') {
            return '/student/dashboard'
        } else if (user?.role === 'teacher') {
            return '/teacher/dashboard'
        }
        return "/"
    }

    return !user ? children : <Navigate to={checkRoute()} replace />;
}
// This component checks if the user is authenticated.
// If the user is not authenticated, it renders the children components.    