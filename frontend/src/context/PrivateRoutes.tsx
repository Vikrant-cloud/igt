import { Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/Loading';
import { useEffect } from 'react';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
        } else if (user?.role === 'student') {
            navigate('/student/dashboard', { replace: true });
        } else if (user?.role === 'teacher') {
            navigate('/teacher/dashboard', { replace: true });
        }
        return
    }, [user])
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