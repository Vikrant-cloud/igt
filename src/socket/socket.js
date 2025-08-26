import { Server } from 'socket.io';

function initSocket(server) {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });


    io.on('connection', (socket) => {
        console.log(`⚡ User connected: ${socket.id}`);

        socket.on('send_message', async (data) => {
            try {
                socket.emit('receive_message', data);
            } catch (error) {
                console.error('Error fetching from LLaMA3 API:', error);
                socket.emit('receive_message', 'Error: could not get response');
            }
        });

        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });

    console.log("Socket.IO connection established", io.engine.clientsCount, "clients connected");


    return io;
}

export default initSocket;
