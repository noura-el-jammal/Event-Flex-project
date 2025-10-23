import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { CalendarIcon, MapPinIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function Index({ favoris: initialFavoris }) {
    const [favoris, setFavoris] = useState(initialFavoris);

    const handleToggleFavorite = async (eventId) => {
        try {
            const response = await axios.post(route('favoris.toggle', eventId));
            if (response.data.success) {
                setFavoris(prevFavoris => 
                    prevFavoris.filter(fav => fav.id_evenement !== eventId)
                );
                toast.success('Événement retiré des favoris');
            }
        } catch (error) {
            toast.error('Une erreur est survenue');
        }
    };

    const renderStars = (eventId) => {
        // Add your star rating logic here if needed
        return null;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Mes Favoris" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Mes Événements Favoris</h2>
                            </div>

                            {favoris.length === 0 ? (
                                <div className="text-center py-12">
                                    <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun favori</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Commencez à ajouter des événements à vos favoris pour les retrouver facilement ici.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('evenements.index')}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            Découvrir des événements
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {favoris.map((evenement) => (
                                        <div key={evenement.id_evenement} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                            <div className="relative">
                                                <img
                                                    src={evenement.image_url}
                                                    alt={evenement.titre}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <button
                                                        onClick={() => handleToggleFavorite(evenement.id_evenement)}
                                                        className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
                                                    >
                                                        <HeartIcon className="h-6 w-6 text-red-500" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{evenement.titre}</h3>
                                                <p className="text-gray-600 mb-4 line-clamp-2">{evenement.description}</p>
                                                <div className="flex items-center text-gray-500 mb-4">
                                                    <CalendarIcon className="h-5 w-5 mr-2" />
                                                    <span>{new Date(evenement.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center text-gray-500 mb-4">
                                                    <MapPinIcon className="h-5 w-5 mr-2" />
                                                    <span>{evenement.lieu}</span>
                                                </div>
                                                <div className="flex items-center text-gray-500 mb-4">
                                                    <UserIcon className="h-5 w-5 mr-2" />
                                                    <span>Organisé par {evenement.organisateur?.name}</span>
                                                </div>
                                                {renderStars(evenement.id_evenement)}
                                                <div className="mt-4 flex justify-between items-center">
                                                    <span className="text-lg font-semibold text-indigo-600">
                                                        {evenement.prix} €
                                                    </span>
                                                    <Link
                                                        href={route('evenements.show', evenement.id_evenement)}
                                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                    >
                                                        Voir détails
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