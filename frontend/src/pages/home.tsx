import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layouts/Layout';
// import Chat from '@/components/Chat';
import { useReactQuery } from '@/utils/useReactQuery';
import { getHomeContentList } from '@/api/auth';
import { ContentList } from '@/components/content';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate()
    useEffect(() => {
        if (user?.role === 'student') {
            console.log("kkkkks");

            navigate('/student/dashboard', { replace: true });
        } else if (user?.role === 'teacher') {
            navigate('/teacher/dashboard', { replace: true });
        }
        return
    }, [user])


    const page = 1; // Example page number
    const limit = 10; // Example limit for pagination
    const { data } = useReactQuery(
        ['homeContent', page, limit],
        () => getHomeContentList({ queryKey: ['homeContent', page, limit] }),
    );
    return (
        <Layout>
            <div className="min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
                <p className="text-lg mb-6">Hello, {user?.name || 'Guest'}!</p>
                {/* <Chat /> */}
                <ContentList data={data} />
            </div>
        </Layout>
    )
}
