import { useEffect, useState } from 'react';
import socket from '../utils/socket';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState<{ text: string; from: string }[]>([]);

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setChat((prev) => [...prev, { text: data, from: 'server' }]);
        });

        return () => { socket.off('receive_message'); }; // cleanup
    }, []);

    // const sendMessage = () => {
    //     if (message.trim()) {
    //         socket.emit('send_message', message);
    //         setChat((prev) => [...prev, { text: message, from: 'me' }]);
    //         setMessage('');
    //     }
    // };

    return (
        <div className="p-4">
            <div className="mb-4">
                {chat.map((msg, index) => (
                    <p key={index} className={msg.from === 'me' ? 'text-blue-500' : 'text-green-500'}>
                        {msg.from}: {msg.text}
                    </p>
                ))}
            </div>
            {/* <form className="flex"> </form> */}
            {/* <input
                className="border px-2 py-1 mr-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button className="bg-blue-500 text-white px-4 py-1" onClick={sendMessage}>Send</button> */}
        </div>
    );
};

export default Chat;
