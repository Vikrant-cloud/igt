import Layout from "@/components/Layouts/Layout";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Dialog, Tab } from "@headlessui/react";
import {
  VideoCameraIcon,
  UserGroupIcon,
  ChatBubbleBottomCenterTextIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  WifiIcon
} from "@heroicons/react/24/outline";
import api from "@/utils/axios";
import { io } from "socket.io-client";
import { useAuth } from "@/hooks/useAuth";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001", {
  withCredentials: true,
});

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth()
  const { data, isLoading, error } = useQuery({
    queryKey: ["course", id],
    queryFn: () => api.get("/content/course/" + id).then((res) => res.data),
  });

  const [chatOpen, setChatOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/messages/${id}`).then(res => setMessages(res.data));
    socket.emit("join_room", id);

    socket.on("receive_chat", (msg) => setMessages(prev => [...prev, msg]));

    socket.on("receive_ai", (msg) => setAiMessages(prev => [...prev, msg]));

    return () => {
      socket.off("receive_chat");
      socket.off("receive_ai");
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiMessages]);

  const handleSend = () => {
    console.log(userId, "userId");

    if (!input.trim()) return;
    socket.emit("send_chat", {
      roomId: id,
      text: input,
      sender: user?._id,
      receiver: userId,
      createdAt: new Date().toISOString(),
    });
    setInput("");
  };

  const handleSendAI = () => {
    if (!aiInput.trim()) return;
    setAiMessages(prev => [...prev, { text: aiInput, type: "user" }]);
    setAiLoading(true);
    socket.emit("send_ai", {
      roomId: id,
      text: aiInput,
      sender: data?.createdBy?._id || "teacher",
      createdAt: new Date().toISOString(),
    });
    setAiInput("");
    setAiLoading(false);
  };

  const handleEdit = () => {
    setEditOpen(true);
  };

  const handleDelete = async () => {
    setDeleteConfirm(false);
    try {
      await api.delete(`/content/course/${id}`);
      window.location.href = "/teacher/courses";
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (isLoading)
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500">Error loading course</div>;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-950">
        
        <div className="relative w-full h-72 md:h-96">
          {data.media?.[0]?.endsWith(".mp4") ? (
            <video className="h-full w-full object-cover" src={data.media[0]} autoPlay muted loop />
          ) : (
            <img className="h-full w-full object-cover" src={data.media?.[0]} alt={data.title} />
          )}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white text-center"
            >
              {data.title}
            </motion.h1>
          </div>
         
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              <PencilSquareIcon className="h-5 w-5" />
              Edit
            </button>
            <button
              onClick={() => setDeleteConfirm(true)}
              className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            >
              <TrashIcon className="h-5 w-5" />
              Delete
            </button>
          </div>
        </div>

        
        <div className="max-w-6xl mx-auto px-4 py-10">
          <Tab.Group>
            <Tab.List className="flex space-x-4 rounded-xl bg-gray-100 dark:bg-gray-800 p-2">
              <Tab className={({ selected }) =>
                `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${selected
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`
              }>
                <InformationCircleIcon className="h-5 w-5" /> Overview
              </Tab>
              <Tab className={({ selected }) =>
                `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${selected
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`
              }>
                <VideoCameraIcon className="h-5 w-5" /> Media
              </Tab>
              <Tab className={({ selected }) =>
                `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${selected
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`
              }>
                <UserGroupIcon className="h-5 w-5" /> Students
              </Tab>
              <Tab className={({ selected }) =>
                `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${selected
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`
              }>
                <ChatBubbleBottomCenterTextIcon className="h-5 w-5" /> Chat
              </Tab>
              <Tab className={({ selected }) =>
                `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${selected
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`
              }>
                <WifiIcon className="h-5 w-5" /> Ask AI
              </Tab>
            </Tab.List>

            <Tab.Panels className="mt-6">
              {/* Overview */}
              <Tab.Panel>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow"
                >
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Course Overview
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">{data.description}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      ₹{data.price}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${data.isApproved
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {data.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                </motion.div>
              </Tab.Panel>

              {/* Media */}
              <Tab.Panel>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {data.media?.map((url: string, i: number) =>
                    url.endsWith(".mp4") ? (
                      <video
                        key={i}
                        src={url}
                        controls
                        className="rounded-xl shadow"
                      />
                    ) : (
                      <img key={i} src={url} alt={`media-${i}`} className="rounded-xl shadow" />
                    )
                  )}
                </motion.div>
              </Tab.Panel>

              {/* Students */}
              <Tab.Panel>
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid sm:grid-cols-2 gap-4"
                >
                  {data.purchasedBy?.map((user: any, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-xl shadow hover:shadow-lg transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                          alt={user.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-100">{user.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setChatOpen(true)
                          setUserId(user._id)
                        }
                        }
                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
                      >
                        Message
                      </button>
                    </li>
                  ))}
                </motion.ul>
              </Tab.Panel>

              {/* Chat */}
              <Tab.Panel>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow h-80 flex flex-col"
                >
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {messages.map((msg, idx) => (
                      <div
                        key={msg._id || idx}
                        className={`flex ${msg.sender === (data?.createdBy?._id || "teacher") ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`rounded-2xl px-4 py-2 max-w-xs ${msg.sender === (data?.createdBy?._id || "teacher") ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                          <span className="block text-sm">{msg.text}</span>
                          <span className="block text-xs text-gray-300 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      className="flex-1 rounded-full border px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="Type a message..."
                      onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
                    />
                    <button
                      className="bg-indigo-600 text-white px-4 rounded-full"
                      onClick={handleSend}
                    >
                      Send
                    </button>
                  </div>
                </motion.div>
              </Tab.Panel>

              {/* Ask AI */}
              <Tab.Panel>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow h-80 flex flex-col"
                >
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {aiMessages.map((msg, idx) => (
                      <div
                        key={msg._id || idx}
                        className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`rounded-2xl px-4 py-2 max-w-xs ${msg.type === "user" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                          <span className="block text-sm">{msg.text}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                      className="flex-1 rounded-full border px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="Ask AI anything..."
                      disabled={aiLoading}
                      onKeyDown={e => { if (e.key === "Enter") handleSendAI(); }}
                    />
                    <button
                      className="bg-indigo-600 text-white px-4 rounded-full"
                      onClick={handleSendAI}
                      disabled={aiLoading}
                    >
                      {aiLoading ? "Thinking..." : "Send"}
                    </button>
                  </div>
                </motion.div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        
        <Dialog open={chatOpen} onClose={() => setChatOpen(false)} className="relative z-50">
          
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
              <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Chat
              </Dialog.Title>
              <div className="mt-4 flex flex-col h-80">
                <div className="flex-1 overflow-y-auto space-y-2">
                  {messages.map((msg, idx) => (
                    <div
                      key={msg._id || idx}
                      className={`flex ${msg.receiver?._id == userId ? "justify-end" : msg.sender?._id == userId ? "justify-start" : ""}`}
                    >
                      <div className={`rounded-2xl px-4 py-2 max-w-xs ${msg.receiver?._id == userId ? " bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                        <span className="block text-sm">{msg.text}</span>
                        <span className="block text-xs text-gray-300 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                      </div>

                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="flex-1 rounded-full border px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Type a message..."
                    onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
                  />
                  <button
                    className="bg-indigo-600 text-white px-4 rounded-full"
                    onClick={() => handleSend()}
                  >
                    Send
                  </button>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setChatOpen(false)}
                  className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
              <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Edit Course
              </Dialog.Title>
              <div className="mt-4">
                {/* Add your edit form here */}
                <p className="text-gray-500">Edit functionality coming soon...</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        
        <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
              <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Confirm Delete
              </Dialog.Title>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Are you sure you want to delete this course? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </Layout>
  );
};

export default CourseDetail;
