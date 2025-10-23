import React, { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { UserCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function Chat({ auth, users, messages: initialMessages, selectedUser, eventId }) {
    const [selectedUserId, setSelectedUserId] = useState(selectedUser?.id || null);
    const [messages, setMessages] = useState(Array.isArray(initialMessages) ? initialMessages : []);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUserId) return;

        const currentEventId = eventId || messages[messages.length - 1]?.id_evenement;

        console.log('Prop eventId in Chat.jsx:', eventId);
        console.log('Calculated currentEventId:', currentEventId);

        if (!selectedUserId) {
            console.error('Cannot send message: No recipient selected');
            return;
        }

        const formData = new FormData();
        formData.append('contenu', newMessage);
        formData.append('id_destinataire', selectedUserId);
        if (currentEventId) {
            formData.append('id_evenement', currentEventId);
        }

        router.post(route('messages.store'), formData, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                setNewMessage('');
                if (page.props.messages) {
                    setMessages(page.props.messages);
                }
                scrollToBottom();
            },
            onError: (errors) => {
                console.error('Error sending message:', errors);
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex h-[calc(100vh-180px)]">
                                {/* Left side: User list */}
                                {/* Commenting out or removing the user list */}
                                {/*
                                <div className="w-1/4 border-r border-gray-200 overflow-y-auto">
                                    <h2 className="text-xl font-semibold p-4">Conversations</h2>
                                    <ul>
                                        {users.map((user) => (
                                            <li
                                                key={user.id}
                                                className={`p-4 cursor-pointer ${
                                                    selectedUserId === user.id
                                                        ? 'bg-blue-100'
                                                        : 'hover:bg-gray-100'
                                                }`}
                                                onClick={() => setSelectedUserId(user.id)}
                                            >
                                                {user.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                */}

                                {/* Right side: Chat area */}
                                <div className="flex-1 flex flex-col">
                                    {selectedUserId ? (
                                        <>
                                            {/* Messages */}
                                            <div className="flex-1 p-4 overflow-y-auto">
                                                <div className="space-y-4">
                                                    {messages.map((message) => (
                                                        <div
                                                            key={message.id_message}
                                                            className={`flex ${
                                                                message.id_utilisateur === auth.user.id
                                                                    ? 'justify-end'
                                                                    : 'justify-start'
                                                            }`}
                                                        >
                                                            <div
                                                                className={`max-w-[70%] rounded-lg p-3 ${
                                                                    message.id_utilisateur === auth.user.id
                                                                        ? 'bg-blue-500 text-white'
                                                                        : 'bg-gray-100'
                                                                }`}
                                                            >
                                                                <p>{message.contenu}</p>
                                                                <p className="text-xs mt-1 opacity-70">
                                                                    {new Date(message.date_envoi).toLocaleTimeString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div ref={messagesEndRef} />
                                                </div>
                                            </div>

                                            {/* Formulaire d'envoi */}
                                            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                                                <div className="flex space-x-2">
                                                    <input
                                                        type="text"
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        placeholder="Écrivez votre message..."
                                                        className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                    >
                                                        <PaperAirplaneIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </form>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center text-gray-500">
                                            Sélectionnez une conversation pour commencer à discuter
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 