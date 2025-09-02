import Layout from "@/components/Layouts/Layout";
import type { User } from "@/context/AuthContext";
import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { Dialog } from "@headlessui/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import socket from "@/utils/socket";

const CourseDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['course'],
    queryFn: () => api.get('/content/course/' + id).then(res => res.data),
  });

  // Message modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string; createdAt: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  // Fetch messages (replace with your API if needed)
  useEffect(() => {
    async function fetchMessages() {
      if (!selectedUser) return;
      setLoading(true);
      // Example API call, replace with your endpoint
      // const res = await api.get(`/messages/teacher/${teacherId}/student/${selectedUser._id}`);
      // setMessages(res.data.messages || []);
      setMessages([
        { sender: "teacher", text: "Welcome to the course!", createdAt: new Date().toISOString() }
      ]);
      setLoading(false);
    }
    if (selectedUser) fetchMessages();
  }, [selectedUser]);

  const handleSend = async () => {
    if (!input.trim() || !selectedUser) return;
    setLoading(true);
    // await api.post("/messages/send", { sender: "teacher", receiver: selectedUser._id, text: input });
    setMessages(prev => [...prev, { sender: "teacher", text: input, createdAt: new Date().toISOString() }]);
    setInput("");
    socket.emit('send_message', input);
    console.log("Message sent:", input);

    socket.on('receive_message', (msg) => {
      console.log("Message received:", msg);

      setMessages(prev => [...prev, { sender: "student", text: msg, createdAt: new Date().toISOString() }]);
      setLoading(false);
    });

    setLoading(false);
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen">Error: {error.message}</div>;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-2 sm:px-4">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {data.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Snapshot of a single course with purchasers and media.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {data.isApproved && (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800">
                  Approved
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-800">
                {data.subject}
              </span>
            </div>
          </div>

          {/* Content Grid */}
          <div className="">
            {/* Media */}
            <section className="lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                {/* Primary Media */}
                <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                  {data.media?.[0]?.endsWith(".mp4") ? (
                    <video
                      className="h-full w-full"
                      controls
                      poster={data.media.find((m: any) => !m.endsWith(".mp4")) || undefined}
                    >
                      <source src={data.media[0]} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      className="h-full w-full object-cover"
                      src={data.media?.[0]}
                      alt={data.title}
                    />
                  )}
                </div>
                {/* Media Thumbnails */}
                <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
                  {data.media?.map((url: string, i: number) => {
                    const isVideo = url.endsWith(".mp4");
                    return isVideo ? (
                      <video
                        key={url + i}
                        className="h-28 w-full rounded-xl object-cover ring-1 ring-gray-200 dark:ring-gray-800"
                        muted
                        playsInline
                      >
                        <source src={url} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        key={url + i}
                        className="h-28 w-full rounded-xl object-cover ring-1 ring-gray-200 dark:ring-gray-800"
                        src={url}
                        alt={`media-${i}`}
                      />
                    );
                  })}
                  {/* spare tile for overflow */}
                  <div className="flex h-28 items-center justify-center rounded-xl bg-gray-100 text-gray-500 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-800">
                    + More
                  </div>
                </div>
              </div>
            </section>

            {/* Sidebar: Details */}
            <aside className="space-y-6">
              {/* Course Card */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">
                  {data.title}
                </h2>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{data.description}</p>
                <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                      Subject: {data.subject}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                      ID: {data._id}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">₹{data.price}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">one-time</div>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Created At</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-200">
                      {new Date(data.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone: "Asia/Kolkata",
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Updated At</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-200">
                      {new Date(data.updatedAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone: "Asia/Kolkata",
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Status</dt>
                    <dd className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.415-1.415L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {data.isApproved ? "Approved" : "Pending"}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Creator / Purchasers Card */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Creator</h3>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(data.createdBy?.name || "Creator")}`}
                      alt="creator avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{data.createdBy?.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{data.createdBy?.email}</div>
                  </div>
                </div>
                <hr className="my-4 border-t border-gray-100 dark:border-gray-800" />
                <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Purchasers ({data.purchasedBy?.length ?? 0})
                </h3>
                <ul className="space-y-3">
                  {data.purchasedBy?.map((user: User, id: string) => (
                    <li
                      key={id}
                      className="flex flex-col sm:flex-row items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <span className="hidden text-xs text-gray-500 dark:text-gray-400 sm:inline">Purchased</span>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          onClick={() => {
                            setSelectedUser(user);
                            setModalOpen(true);
                          }}
                        >
                          Message
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
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
                      className={`mb-2 flex ${msg.sender === "teacher" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`rounded-lg px-4 py-2 max-w-xs ${msg.sender === "teacher" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                        <span className="block text-sm">{msg.text}</span>
                        <span className="block text-xs text-gray-300 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
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
};

export default CourseDetail;