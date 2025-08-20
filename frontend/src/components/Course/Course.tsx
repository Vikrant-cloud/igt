import type { Content } from "@/pages/courses";

const Course = ({ item }: { item: Content }) => {
    return (
        <>
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
                <p className="text-xs text-gray-400">Price: Rs{item.price}</p>
            </div>
        </>
    )
}

export default Course