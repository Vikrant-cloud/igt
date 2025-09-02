import { Server } from 'socket.io';
import axios from 'axios';

function initSocket(server) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const API_ENDPOINT = process.env.GEMINI_API
    const headers = {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
    };

    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });


    io.on('connection', (socket) => {
        // console.log(`⚡ User connected:`, socket);
        console.log("Socket.IO connection established", io.engine.clientsCount, "clients connected");


        socket.on('send_message', async (message) => {
            try {
                const data = {
                    contents: [
                        {
                            parts: [
                                {
                                    text: message,
                                },
                            ],
                        },
                    ],
                };
                const response = await axios.post(API_ENDPOINT, data, { headers: headers });
                // The response data contains the generated content
                const generatedText = response.data.candidates[0].content.parts[0].text;
                console.log(generatedText);
                socket.emit('receive_message', generatedText);

                return generatedText;

            } catch (error) {
                console.error('Error fetching from LLaMA3 API:', error);
                socket.emit('receive_message', 'Error: could not get response');
            }
        });

        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });



    return io;
}

export default initSocket;
