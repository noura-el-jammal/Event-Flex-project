import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';

export default function MessagesDropdown({ auth }) {
    const [conversations, setConversations] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.get(route('messages.navigation'));
                setConversations(response.data.conversations);
                setLoading(false);
            } catch (err) {
                console.error('Erreur lors du chargement des conversations:', err);
                setError('Erreur lors du chargement des conversations');
                setLoading(false);
            }
        };

        fetchConversations();
        // Rafraîchir les conversations toutes les 30 secondes
        const interval = setInterval(fetchConversations, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-gray-300 hover:text-white focus:outline-none"
            >
                <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {conversations.some(conv => conv.unread_count > 0) && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {conversations.reduce((total, conv) => total + conv.unread_count, 0)}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                    </div>

                    {loading ? (
                        <div className="px-4 py-2 text-gray-500">Chargement...</div>
                    ) : error ? (
                        <div className="px-4 py-2 text-red-500">{error}</div>
                    ) : conversations.length === 0 ? (
                        <div className="px-4 py-2 text-gray-500">Aucune conversation</div>
                    ) : (
                        <div className="max-h-96 overflow-y-auto">
                            {conversations.map((conversation) => (
                                <Link
                                    key={conversation.id}
                                    href={route('messages.show', conversation.id)}
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="h-8 w-8 rounded-full"
                                                    src={conversation.other_user.profile_photo_url}
                                                    alt={conversation.other_user.name}
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {conversation.other_user.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {conversation.last_message?.contenu}
                                                </p>
                                            </div>
                                        </div>
                                        {conversation.unread_count > 0 && (
                                            <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {conversation.unread_count}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="px-4 py-2 border-t">
                        <Link
                            href={route('messages.index')}
                            className="block text-center text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => setIsOpen(false)}
                        >
                            Voir toutes les conversations
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
} 