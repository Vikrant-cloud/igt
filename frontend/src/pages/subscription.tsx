import Layout from '@/components/Layouts/Layout';
import { useAuth } from '@/hooks/useAuth';
import api from '@/utils/axios';

export default function Home() {
    const { user } = useAuth()
    const handleSubscribe = async () => {
        const res = await api.post('/subscription/create-checkout-session', {
            email: user?.email,
        });
        window.location.href = res.data.url;
    };

    return (
        <Layout>
            <div className="p-10">
                <h1 className="text-2xl font-bold">Welcome to the Subscription Page</h1>
                <p className="mt-4">Hello, {user?.name || 'Guest'}!</p>
                <p className="mt-2">Your email: {user?.email}</p>
                <p className="mt-2">Role: {user?.role}</p>
                <div className="mt-6">
                    <button
                        onClick={handleSubscribe}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Subscribe Now
                    </button>
                </div>
            </div>
        </Layout>
    );
}
