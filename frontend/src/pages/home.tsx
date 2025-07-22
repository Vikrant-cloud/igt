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
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
                <p className="text-lg mb-6">Hello, {user?.name || 'Guest'}!</p>
                <Chat />
                {data?.contents?.length === 0 ? (
                    <p className="text-gray-500">No content added yet.</p>
                ) : (
                    <div className="grid gap-4">
                        {data?.contents.map((item: Content, idx: string) => (
                            <div key={idx} className="border p-4 rounded-lg shadow">
                                <h2 className="text-xl font-semibold">{item.title}</h2>
                                <p className="text-sm text-gray-600">Subject: {item.subject}</p>
                                <p className="mt-2">{item.description}</p>
                                {item.media && (
                                    <video width="240" height="360" controls>
                                        <source key={item.media} src={item.media} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                <p className="text-xs text-gray-400 mt-2">
                                    Created at: {new Date(item.createdAt).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Created By: {typeof item.createdBy === 'string' ? item.createdBy : item.createdBy.name}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}
