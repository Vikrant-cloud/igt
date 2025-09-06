import { Server } from "socket.io";
import axios from "axios";
import Message from "../models/message.model.js";

function initSocket(server) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const API_ENDPOINT = process.env.GEMINI_API;
    const headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY,
    };

    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("✅ New client connected:", socket.id);

        // Join course room
        socket.on("join_room", (roomId) => {
            socket.join(roomId);
            console.log(`📌 User joined room: ${roomId}`);
        });

        // Chat messages
        socket.on("send_chat", async ({ roomId, text, sender, receiver }) => {
            try {
                const msg = await Message.create({ roomId, text, sender, receiver, type: "chat" });
                console.log(msg, receiver);

                const populated = await msg.populate([
                    { path: "sender", select: "name email role" },
                    { path: "receiver", select: "name email role" },
                ]);
                io.to(roomId).emit("receive_chat", populated);
            } catch (err) {
                console.error("❌ Chat save error:", err);
                socket.emit("error_message", "Failed to send message");
            }
        });

        // AI messages
        socket.on("send_ai", async ({ roomId, text, sender }) => {
            console.log({ roomId, text, sender });

            try {
                const response = await axios.post(
                    API_ENDPOINT,
                    { contents: [{ parts: [{ text }] }] },
                    { headers }
                );
                const aiText =
                    response.data.candidates?.[0]?.content?.parts?.[0]?.text || "AI failed to respond";

                // Save user + AI messages
                await Message.create({ roomId, text, sender, type: "ai" });
                const aiMessage = await Message.create({ roomId, text: aiText, sender, type: "ai" });

                socket.emit("receive_ai", aiMessage);
            } catch (err) {
                console.error("❌ AI error:", err);
                socket.emit("receive_ai", { text: "Error from AI", type: "ai" });
            }
        });

        socket.on("disconnect", () => {
            console.log("❌ Client disconnected:", socket.id);
        });
    });

    return io;
}

export default initSocket;
