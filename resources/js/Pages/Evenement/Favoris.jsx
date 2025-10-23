import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

export default function Favoris({ auth, favoris }) {
    return (
        <AuthenticatedLayout user={auth?.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-6">Mes événements favoris</h1>
                            
                            {favoris.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">
                                    Vous n'avez pas encore d'événements favoris
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {favoris.map((favori) => (
                                        <div key={favori.id_evenement} className="bg-white border border-app-light-pink rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                            <div className="p-4">
                                                <h2 className="text-xl font-semibold mb-2">{favori.evenement.titre}</h2>
                                                <p className="text-gray-600 mb-2">
                                                    <span className="font-medium">Date:</span>{' '}
                                                    {new Date(favori.evenement.date_debut).toLocaleDateString()}
                                                </p>
                                                <p className="text-gray-600 mb-2">
                                                    <span className="font-medium">Lieu:</span>{' '}
                                                    {favori.evenement.lieu}
                                                </p>
                                                <div className="mt-4">
                                                    <Link
                                                        href={route('evenements.show', favori.id_evenement)}
                                                        className="px-4 py-2 bg-app-light-pink text-gray-900 rounded-md hover:bg-app-pink-medium transition-colors"
                                                    >
                                                        Voir les détails
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 