import React, { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import ErrorBoundary from '@/Components/ErrorBoundary';

const EventChat = ({ auth, evenement, otherUser, messages: initialMessages, error: initialError }) => {
    const [messages, setMessages] = useState(initialMessages || []);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(initialError || null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!auth?.user || !otherUser) {
            setError('Données manquantes pour le chat');
            return;
        }
    }, [auth, otherUser]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const data = {};
            if (evenement?.id_evenement) {
                data.evenement = evenement.id_evenement;
            }

            await router.visit(route('chat.show', otherUser.id), {
                method: 'get',
                data,
                preserveState: true,
                preserveScroll: true,
                only: ['messages', 'error'],
                onSuccess: (page) => {
                    if (page.props.messages) {
                        setMessages(page.props.messages);
                    }
                    if (page.props.error) {
                        setError(page.props.error);
                    } else {
                        setError(null);
                    }
                },
                onError: (errors) => {
                    console.error('Erreur lors du rafraîchissement des messages:', errors);
                    setError('Erreur lors du rafraîchissement des messages');
                }
            });
        } catch (err) {
            console.error('Erreur lors du rafraîchissement des messages:', err);
            setError('Erreur lors du rafraîchissement des messages');
        }
    };

    useEffect(() => {
        // Rafraîchir les messages toutes les 5 secondes
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [otherUser.id, evenement?.id_evenement]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !otherUser) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = {
                contenu: newMessage.trim(),
                id_destinataire: otherUser.id
            };

            if (evenement?.id_evenement) {
                data.id_evenement = evenement.id_evenement;
            }

            await router.post(route('chat.store'), data, {
                preserveScroll: true,
                onSuccess: () => {
                    setNewMessage('');
                    // Rafraîchir immédiatement les messages après l'envoi
                    fetchMessages();
                },
                onError: (errors) => {
                    console.error('Error sending message:', errors);
                    if (errors.contenu) {
                        setError(errors.contenu);
                    } else {
                        setError('Erreur lors de l\'envoi du message');
                    }
                }
            });
        } catch (err) {
            console.error('Error in handleSubmit:', err);
            setError('Erreur lors de l\'envoi du message');
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-red-600">{error}</div>
                            <Link href={route('messages.index')} className="text-blue-600 hover:underline mt-4 inline-block">
                                Retour aux conversations
                            </Link>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 flex flex-col h-[calc(100vh-180px)]">
                            {/* Chat Header */}
                            <div className="border-b border-gray-200 pb-4 mb-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            Conversation avec {otherUser?.name}
                                        </h2>
                                        {evenement?.titre && (
                                            <p className="text-sm text-gray-600">
                                                Événement : {evenement.titre}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-500">
                                            {otherUser?.role === 'organisateur' ? 'Organisateur' : 'Participant'}
                                        </p>
                                    </div>
                                    <Link 
                                        href={evenement?.id_evenement ? route('evenements.show', evenement.id_evenement) : route('messages.index')}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        {evenement?.id_evenement ? 'Retour à l\'événement' : 'Retour aux conversations'}
                                    </Link>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
                                {messages.length === 0 ? (
                                    <div className="text-center text-gray-500 py-4">
                                        Aucun message. Commencez la conversation !
                                    </div>
                                ) : (
                                    messages.map((message) => (
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
                                                        : 'bg-gray-200'
                                                }`}
                                            >
                                                <p className="break-words">{message.contenu}</p>
                                                <p className="text-xs mt-1 opacity-80 text-right">
                                                    {new Date(message.date_envoi).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input Form */}
                            <form onSubmit={handleSubmit} className="mt-4 p-4 border-t border-gray-200">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Écrivez votre message..."
                                        className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading || !newMessage.trim()}
                                        className={`px-4 py-2 rounded-lg ${
                                            isLoading || !newMessage.trim()
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        }`}
                                    >
                                        <PaperAirplaneIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

// Wrapper component with ErrorBoundary
const EventChatWithErrorBoundary = (props) => (
    <ErrorBoundary>
        <EventChat {...props} />
    </ErrorBoundary>
);

export default EventChatWithErrorBoundary; 