// socket.js
const { Server } = require('socket.io');

function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173', // React app URL
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`⚡ User connected: ${socket.id}`);

        socket.on('send_message', async (data) => {
            const res = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama3",
                    prompt: data,
                    stream: false
                })
            });
            //console.log(res.json());
            const resData = await res.json();
            console.log(resData.response);
            socket.emit('receive_message', resData.response);
        });

        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });

    return io;
}

module.exports = initSocket;
