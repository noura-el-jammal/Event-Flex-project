import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import Echo from 'laravel-echo';
import ErrorBoundary from '@/Components/ErrorBoundary';
import { router } from '@inertiajs/react';

function ConversationsContent({ auth, messages: initialMessages, user, isOrganisateur }) {
    const [messages, setMessages] = useState(initialMessages || []);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const { post, processing } = useForm();
    const [echo, setEcho] = useState(null);
    const [channel, setChannel] = useState(null);

    // Log des données reçues pour le débogage
    useEffect(() => {
        console.log('Données reçues:', {
            auth,
            user,
            isOrganisateur,
            initialMessages,
            messagesCount: initialMessages.length
        });
    }, [auth, user, isOrganisateur, initialMessages]);

    // Vérification initiale des props
    if (!auth?.user || !user) {
        console.warn('Données manquantes:', { auth, user });
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Chargement de la conversation...</p>
            </div>
        );
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!auth.user?.id || !user?.id) {
            console.warn('IDs manquants:', { userId: auth.user?.id, otherUserId: user?.id });
            return;
        }

        try {
            // Vérification des variables d'environnement Pusher
            const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
            const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;

            if (!pusherKey || !pusherCluster) {
                console.warn('Variables d\'environnement Pusher manquantes');
                return;
            }

            // Configuration de Pusher
            const newEcho = window.Echo;
            if (!newEcho) {
                console.warn('Echo n\'est pas disponible');
                return;
            }

            setEcho(newEcho);

            // Création du canal privé
            const channelName = `private-chat.${Math.min(auth.user.id, user.id)}.${Math.max(auth.user.id, user.id)}`;
            const newChannel = newEcho.private(channelName);

            newChannel.listen('NewMessage', (e) => {
                console.log('Nouveau message reçu:', e);
                setMessages(prev => [...prev, e.message]);
            });

            setChannel(newChannel);

            return () => {
                if (newChannel) {
                    newChannel.stopListening('NewMessage');
                }
            };
        } catch (error) {
            console.error('Erreur lors de la configuration de Pusher:', error);
            setError('Erreur de configuration du chat en temps réel');
        }
    }, [auth.user?.id, user?.id]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !auth.user?.id || !user?.id) return;

        try {
            const response = await router.post(route('messages.store'), {
                id_destinataire: user.id,
                contenu: newMessage
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setNewMessage('');
                },
                onError: (errors) => {
                    console.error('Erreur lors de l\'envoi du message:', errors);
                    setError('Erreur lors de l\'envoi du message');
                }
            });
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            setError('Erreur lors de l\'envoi du message');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                        Aucun message. Commencez la conversation !
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.id_utilisateur === auth.user.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                    message.id_utilisateur === auth.user.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                }`}
                            >
                                <p>{message.contenu}</p>
                                <p className="text-xs mt-1 opacity-70">
                                    {new Date(message.date_envoi).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrivez votre message..."
                        className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Envoyer
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function Conversations(props) {
    // Vérification des props au niveau du composant wrapper
    if (!props.auth?.user) {
        return (
            <AuthenticatedLayout>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <p className="text-gray-500">Veuillez vous connecter pour accéder aux conversations.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <ErrorBoundary>
            <AuthenticatedLayout user={props.auth.user}>
                <Head title={`Conversation avec ${props.user?.name || 'Utilisateur'}`} />
                <ConversationsContent {...props} />
            </AuthenticatedLayout>
        </ErrorBoundary>
    );
} 