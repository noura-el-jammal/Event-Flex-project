import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router } from '@inertiajs/react';
import { CalendarIcon, MapPinIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Show({ auth, evenement }) {
    const handleContact = () => {
        const defaultMessage = `Bonjour, je suis intéressé(e) par votre événement "${evenement.titre}" qui se déroule le ${new Date(evenement.date_debut).toLocaleDateString()}. Pourriez-vous me donner plus d'informations ?`;
        
        router.visit(route('conversations.detail', evenement.id_organisateur), {
            method: 'get',
            data: {
                initialMessage: defaultMessage
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête de l'événement */}
                            <div className="mb-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h1 className="text-3xl font-bold text-gray-900">{evenement.titre}</h1>
                                    {auth.user.id === evenement.id_organisateur && (
                                        <div className="flex space-x-4">
                                            <Link
                                                href={route('evenements.edit', evenement.id_evenement)}
                                                className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                Modifier l'événement
                                            </Link>
                                            <Link
                                                href={route('programmes.create', evenement.id_evenement)}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Ajouter un programme
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Informations de base */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div className="flex items-center space-x-2">
                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                        <span>{new Date(evenement.date_debut).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                                        <span>{evenement.lieu}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                        <span>Organisé par {evenement.organisateur?.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ClockIcon className="h-5 w-5 text-gray-400" />
                                        <span>{evenement.duree} minutes</span>
                                    </div>
                                </div>

                                {/* Image de l'événement */}
                                {evenement.image && (
                                    <div className="mb-6">
                                        <img 
                                            src={`/storage/${evenement.image}`} 
                                            alt={evenement.titre}
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                    </div>
                                )}

                                {/* Bouton de contact */}
                                {auth.user.id !== evenement.id_organisateur && (
                                    <div className="mt-4">
                                        <button
                                            onClick={handleContact}
                                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Contacter l'organisateur
                                        </button>
                                    </div>
                                )}

                                {/* Description */}
                                <div className="mt-6">
                                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                                    <p className="text-gray-600">{evenement.description}</p>
                                </div>
                            </div>

                            {/* Bouton retour */}
                            <div className="mt-6">
                                <Link
                                    href={route('evenements.index')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Retour à la liste des événements
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 