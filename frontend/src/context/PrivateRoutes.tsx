import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/Loading';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const location = useLocation();
    
    if (loading) {
        return <Loading />
    }

    if (!user) {
        return <Navigate to={'/login'} replace />
    }
    if (user && (user.role === 'student' || user.role === 'teacher') && user.isVerified === false) {
        if (location.pathname === '/approval-pending') {
            return children;
        } else {
            return <Navigate to="/approval-pending" replace />;
        }
    }
    if (user.role === 'admin') {
        return children
    } else if (user.role === 'student') {
        return children
    } else if (user.role === 'teacher') {
        return children
    }

    return children
}