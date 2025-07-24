import Layout from '@/components/Layouts/Layout';
import { useAuth } from '@/hooks/useAuth';
import api from '@/utils/axios';
import clsx from 'clsx';

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
                        disabled={user?.subscriptionStatus === 'active'}
                        className={clsx(
                            'w-full bg-red-500 text-white py-3 rounded-full font-semibold tracking-widest transition',
                            user?.subscriptionStatus === "active" ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-red-600'
                        )}
                    >
                        {user?.subscriptionStatus === "active" ? "Subscribed" : "Subscribe Now"}
                    </button>
                    {user?.subscriptionStatus === "active" && user?.currentPeriodEnd && (
                        <p className="mt-2 text-green-500">You are currently subscription ends {new Date(user?.currentPeriodEnd).toLocaleString()}</p>
                    )}

                </div>
            </div>
        </Layout>
    );
}
