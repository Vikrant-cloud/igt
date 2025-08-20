import { Server } from 'socket.io';

function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL, // React app URL
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`⚡ User connected: ${socket.id}`);

        socket.on('send_message', async (data) => {
            try {
                console.log(data, "kjjjjj");

                const res = await fetch(process.env.LLAMA3_URL + '/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'llama3',
                        prompt: data,
                        stream: false,
                    }),
                });

                const resData = await res.json();
                socket.emit('receive_message', resData.response);
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
