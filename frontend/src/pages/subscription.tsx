import Layout from '@/components/Layouts/Layout';
import { useAuth } from '@/hooks/useAuth';
import api from '@/utils/axios';
import clsx from 'clsx';
import { HiOutlineBadgeCheck } from 'react-icons/hi';
import { FaCrown } from 'react-icons/fa';
import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const handleSubscribe = async () => {
        setLoading(true)
        const res = await api.post('/subscription/create-checkout-session', {
            email: user?.email,
        });
        window.location.href = res.data.url;
    };

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center from-indigo-50 via-white ">
                <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center">
                    <span className="text-yellow-400 mb-4 drop-shadow-lg"><FaCrown size={40} /></span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 mb-2 text-center tracking-tight">Unlock Premium Subscription</h1>
                    <p className="text-lg text-gray-600 mb-6 text-center">Welcome, <span className="font-semibold text-indigo-600">{user?.name || 'Guest'}</span>!</p>
                    <div className="w-full flex flex-col gap-2 mb-6">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <span className="text-green-500"><HiOutlineBadgeCheck size={20} /></span>
                            <span>Your email:</span> <span className="font-medium text-gray-700 text-base">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <span className="text-blue-500"><HiOutlineBadgeCheck size={20} /></span>
                            <span>Role:</span> <span className="font-medium text-gray-700 text-base">{user?.role}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleSubscribe}
                        disabled={user?.subscriptionStatus === 'active' || loading}
                        className={clsx(
                            'w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-4 rounded-full font-bold text-lg shadow-lg transition',
                            user?.subscriptionStatus === "active" || loading ? 'cursor-not-allowed' : 'cursor-pointer hover:from-indigo-600 hover:to-pink-600'
                        )}
                    >
                        {loading ? <LoadingSpinner /> : user?.subscriptionStatus === "active" ? "Subscribed" : "Subscribe Now"}
                    </button>
                    {user?.subscriptionStatus === "active" && user?.currentPeriodEnd && (
                        <p className="mt-4 text-green-600 font-semibold text-center">Your subscription ends {new Date(user?.currentPeriodEnd).toLocaleString()}</p>
                    )}
                </div>
            </div>
        </Layout>
    );
}
