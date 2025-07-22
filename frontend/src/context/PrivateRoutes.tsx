import { Navigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/Loading';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    if (loading) {
        return <Loading />
    }
    return user ? children : <Navigate to={'/login'} replace />;
}
// This component checks if the user is authenticated.
// If the user is authenticated, it renders the children components.
// If not, it redirects to the login page.