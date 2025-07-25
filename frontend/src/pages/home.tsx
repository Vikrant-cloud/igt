import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layouts/Layout';
import Chat from '@/components/Chat';
import { useReactQuery } from '@/utils/useReactQuery';
import { getHomeContentList } from '@/api/auth';
import type { Content } from '@/pages/content';

export default function Home() {
    const { user } = useAuth();
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
                <Chat />
                {data?.contents?.length === 0 ? (
                    <p className="text-gray-500">No content added yet.</p>
                ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {data?.contents.map((item: Content, idx: string) => (
                            <div
                                key={idx}
                                className="flex flex-col border border-gray-200 bg-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full group"
                            >
                                <div className="flex-1 flex flex-col gap-2">
                                    <h2 className="text-xl font-bold text-indigo-700 group-hover:text-indigo-900 transition-colors truncate mb-1">{item.title}</h2>
                                    <p className="text-xs text-gray-400 mb-1">Subject: <span className="text-gray-600 font-medium">{item.subject}</span></p>
                                    <p className="text-gray-700 text-sm mb-2 line-clamp-3">{item.description}</p>
                                    {item.media && (
                                        <div className="w-full aspect-video rounded-lg overflow-hidden mb-2 bg-gray-100 flex items-center justify-center">
                                            <video className="w-full h-full object-cover rounded-lg" controls>
                                                <source key={item.media} src={item.media} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-auto pt-2 border-t border-gray-100 flex flex-col gap-1">
                                    <p className="text-xs text-gray-400">Created at: <span className="text-gray-500">{new Date(item.createdAt).toLocaleString()}</span></p>
                                    <p className="text-xs text-gray-400">Created By: <span className="text-gray-500">{typeof item.createdBy === 'string' ? item.createdBy : item.createdBy.name}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}
