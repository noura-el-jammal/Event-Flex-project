import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, conversations, error }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Messages" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-semibold mb-6">Messages</h1>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}

                            {conversations && conversations.length > 0 ? (
                                <div className="space-y-4">
                                    {conversations.map((conversation) => (
                                        <Link
                                            key={conversation.id}
                                            href={route('conversations.show', { user: conversation.other_user.id })}
                                            className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <EnvelopeIcon className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {conversation.other_user.name}
                                                    </p>
                                                    {conversation.last_message && (
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {conversation.last_message.contenu}
                                                        </p>
                                                    )}
                                                </div>
                                                {conversation.last_message && (
                                                    <div className="flex-shrink-0 text-sm text-gray-500">
                                                        {new Date(conversation.last_message.date_envoi).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune conversation</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Commencez une nouvelle conversation en visitant un événement.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 