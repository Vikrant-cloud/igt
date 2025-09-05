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
        if (location.pathname.startsWith('/admin')) {
            return children
        }
        return <Navigate to="/admin/dashboard" replace />
    } else if (user.role === 'student') {
        if (location.pathname.startsWith('/student')) {
            return children
        }
        return <Navigate to="/student/dashboard" replace />
    } else if (user.role === 'teacher') {
        if (location.pathname.startsWith('/teacher')) {
            return children
        }
        return <Navigate to="/teacher/dashboard" replace />
    }

    return children
}