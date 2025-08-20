import { useState } from "react";
import type { Content } from "@/pages/courses";

type ContentList = {
    contents: Content[]
}

const ChatModal = ({
    isOpen,
    onClose,
    teacherName,
}: {
    isOpen: boolean;
    onClose: () => void;
    teacherName: string;
}) => {
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { sender: "You", text: input }]);
            setInput("");
            // Add logic to send message to teacher via API if needed
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? "" : "hidden"}`}>
            <div className="fixed inset-0 bg-black/30" onClick={onClose} />
            <div className="bg-white rounded-lg shadow-xl p-6 z-10 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                >
                    ✕
                </button>
                <h2 className="text-lg font-bold mb-2">Chat with {teacherName}</h2>
                <div className="border rounded p-2 h-48 overflow-y-auto mb-2 bg-gray-50">
                    {messages.length === 0 ? (
                        <p className="text-gray-400 text-sm">No messages yet.</p>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className="mb-1">
                                <span className="font-semibold">{msg.sender}: </span>
                                <span>{msg.text}</span>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className="flex-1 border rounded p-2"
                        placeholder="Type your message..."
                    />
                    <button
                        type="button"
                        onClick={handleSend}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ContentList = ({
    data,
    userRole
}: {
    data: ContentList;
    userRole?: string;
}) => {
    
    const [chatOpen, setChatOpen] = useState(false);
    const [chatTeacher, setChatTeacher] = useState<string>("");

    const handleChat = (teacherName: string) => {
        setChatTeacher(teacherName);
        setChatOpen(true);
    };

    const handleBuy = (courseId: string) => {
        // Add your buy course logic here (e.g., redirect to Stripe/payment page)
        alert(`Buy course: ${courseId}`);
    };

    return (
        <>
            {data?.contents?.length === 0 ? (
                <p className="text-gray-500">No content added yet.</p>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {data?.contents.map((item: Content) => (
                        <div
                            key={item._id}
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
                            <div className="flex gap-2 mt-4">
                                {userRole === "student" && (
                                    <button
                                        onClick={() => handleBuy(item._id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold shadow"
                                    >
                                        Buy Course
                                    </button>
                                )}
                                <button
                                    onClick={() => handleChat(typeof item.createdBy === 'string' ? item.createdBy : item.createdBy.name)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow"
                                >
                                    Chat with Teacher
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} teacherName={chatTeacher} />
        </>
    );
}