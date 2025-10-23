import React from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ErrorBoundary from '@/Components/ErrorBoundary';

const ChatIndex = ({ auth, conversations }) => {
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-6">Mes Conversations</h2>
                            
                            {conversations.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    Vous n'avez pas encore de conversations
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {conversations.map((conversation) => (
                                        <Link
                                            key={conversation.id}
                                            href={route('chat.show', conversation.other_user.id)}
                                            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-medium text-lg">
                                                        {conversation.other_user.name}
                                                    </h3>
                                                    {conversation.last_message && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {conversation.last_message.contenu}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    {conversation.last_message && (
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(conversation.last_message.date_envoi).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                    {conversation.unread_count > 0 && (
                                                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
                                                            {conversation.unread_count}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

// Wrapper component with ErrorBoundary
const ChatIndexWithErrorBoundary = (props) => (
    <ErrorBoundary>
        <ChatIndex {...props} />
    </ErrorBoundary>
);

export default ChatIndexWithErrorBoundary; 