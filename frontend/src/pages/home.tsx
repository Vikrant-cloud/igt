import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layouts/Layout';
import Chat from '@/components/Chat';

export default function Home() {
    const { user } = useAuth();
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
                <p className="text-lg mb-6">Hello, {user?.name || 'Guest'}!</p>
                <Chat />
            </div>
        </Layout>
    )
}
