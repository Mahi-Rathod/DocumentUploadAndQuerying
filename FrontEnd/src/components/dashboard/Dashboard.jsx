import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const { userId } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        const newMessage = { role: 'user', content: prompt };
        setMessages([...messages, newMessage]);
        setPrompt('');
        setLoading(true);

        try {
            const formData = new FormData();
            console.log(userId);
            formData.append("userId", userId);
            formData.append("query", prompt);
            const response = await axios.post("http://127.0.0.1:8000/query",formData);
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'bot', content: response.data.answer },
            ]);
        } catch (error) {
            console.error('Error fetching response:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'bot', content: 'Error fetching response, please try again.' },
            ]);
        } finally {
            setLoading(false);
        }
    };


    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg" style={{ height: '80vh' }}>
                <div className="mb-4 h-[85%] overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-2 my-2 rounded-lg ${msg.role === 'user'
                                    ? 'bg-blue-500 text-white self-end'
                                    : 'bg-gray-200 text-gray-800 self-start'
                                }`}
                        >
                            {msg.content}
                        </div>
                    ))}
                    {loading && <div className="text-gray-500">Loading...</div>}
                </div>

                <form onSubmit={handleSubmit} className="flex">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Type your prompt..."
                        className="w-full p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
