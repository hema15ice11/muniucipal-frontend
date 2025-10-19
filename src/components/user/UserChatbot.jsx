import { useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const UserChatbot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: 'Hi! I am here to help you with your complaints and municipal updates.', from: 'bot' },
    ]);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (!input.trim()) return;

        // Log user input
        console.log("➡ Sending message:", input);
        setMessages(prev => [...prev, { text: input, from: 'user' }]);
        setInput('');

        try {
            const res = await axios.post(
                `${API_URL}/api/chat`,
                { message: input },
                { withCredentials: true } // important to send session cookie
            );

            console.log("⬅ Received reply:", res.data.reply);

            const botReply = res.data.reply || "Sorry, I couldn't fetch your information right now.";
            setMessages(prev => [...prev, { text: botReply, from: 'bot' }]);
        } catch (err) {
            console.error("Chat error:", err);
            setMessages(prev => [...prev, { text: "Oops! Something went wrong.", from: 'bot' }]);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {open ? (
                <div className="w-80 h-96 bg-white shadow-xl rounded-xl flex flex-col overflow-hidden">
                    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                        <span>Help Bot</span>
                        <button onClick={() => setOpen(false)}>X</button>
                    </div>
                    <div className="flex-1 p-2 overflow-y-auto space-y-2">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={msg.from === 'bot' ? 'text-left' : 'text-right'}>
                                <div className={`inline-block p-2 rounded-md whitespace-pre-wrap ${msg.from === 'bot' ? 'bg-gray-100' : 'bg-blue-100'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 flex space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            className="flex-1 border rounded px-2 py-1"
                            placeholder="Type your message..."
                        />
                        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-1 rounded">Send</button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setOpen(true)} className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center">💬</button>
            )}
        </div>
    );
};

export default UserChatbot;
