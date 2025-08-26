import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import api from "@/utils/axios";
import { useAuth } from "@/hooks/useAuth";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Layout from "@/components/Layouts/Layout";

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface Message {
  sender: string;
  receiver: string;
  text: string;
  createdAt: string;
}

const subscribedUsers = [
  {
    "_id": "stu123",
    "name": "Amit Sharma",
    "email": "amit.sharma@example.com",
    "profilePicture": "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    "_id": "stu124",
    "name": "Priya Singh",
    "email": "priya.singh@example.com",
    "profilePicture": "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    "_id": "stu125",
    "name": "Rahul Verma",
    "email": "rahul.verma@example.com",
    "profilePicture": "https://randomuser.me/api/portraits/men/65.jpg"
  }
]

export default function Messages() {
  const { user } = useAuth();
  //const [subscribedUsers, setSubscribedUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch all users who subscribed to teacher's courses
  // useEffect(() => {
  //   async function fetchSubscribedUsers() {
  //     const res = await api.get(`/subscription/teacher-subscribers/${user?._id}`);
  //     setSubscribedUsers(res.data.users || []);
  //   }
  //   if (user?._id) fetchSubscribedUsers();
  // }, [user]);

  // Fetch messages with selected user
  useEffect(() => {
    async function fetchMessages() {
      if (!selectedUser) return;
      setLoading(true);
      const res = await api.get(`/messages/teacher/${user?._id}/student/${selectedUser._id}`);
      setMessages(res.data.messages || []);
      setLoading(false);
    }
    if (selectedUser) fetchMessages();
  }, [selectedUser, user]);

  const handleSend = async () => {
    if (!input.trim() || !selectedUser) return;
    setLoading(true);
    await api.post("/messages/send", {
      sender: user?._id,
      receiver: selectedUser._id,
      text: input,
    });
    setInput("");
    // Refresh messages
    const res = await api.get(`/messages/teacher/${user?._id}/student/${selectedUser._id}`);
    setMessages(res.data.messages || []);
    setLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 flex flex-col items-center py-8">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Subscribed Students</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {subscribedUsers.map((student) => (
              <div
                key={student._id}
                className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300"
              >
                <img
                  src={student.profilePicture || "/default-avatar.png"}
                  alt={student.name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-indigo-300 mb-2"
                />
                <h2 className="text-lg font-semibold text-indigo-800">{student.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{student.email}</p>
                <button
                  onClick={() => { setSelectedUser(student); setModalOpen(true); }}
                  className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold shadow transition-colors"
                >
                  Message
                </button>
              </div>
            ))}
            {subscribedUsers.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">
                No students have subscribed to your courses yet.
              </div>
            )}
          </div>
        </div>
        {/* Message Modal */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg p-6 shadow-xl relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
              <Dialog.Title className="text-lg font-bold mb-4 text-indigo-700">
                Chat with {selectedUser?.name}
              </Dialog.Title>
              <div className="border rounded p-2 h-64 overflow-y-auto mb-2 bg-gray-50 flex flex-col">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>
                ) : messages.length === 0 ? (
                  <p className="text-gray-400 text-sm">No messages yet.</p>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-2 flex ${msg.sender === user?._id ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`rounded-lg px-4 py-2 max-w-xs ${msg.sender === user?._id ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                        <span className="block text-sm">{msg.text}</span>
                        <span className="block text-xs text-gray-300 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                      </div>
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
                  disabled={loading}
                  onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-1"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                  Send
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </Layout>
  );
}