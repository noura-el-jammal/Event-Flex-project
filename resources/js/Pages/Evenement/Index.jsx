import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { CalendarIcon, MapPinIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import FavoriButton from '@/Components/FavoriButton';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({user, auth, evenements = [], favoris = [], initialUserRatings = {}, initialAverageRatings = {}, filters }) {
    console.log('Component props:', { evenements, auth, flash: filters });
    const [userRatings, setUserRatings] = useState(initialUserRatings || {});
    const [averageRatings, setAverageRatings] = useState(initialAverageRatings || {});
    const { flash } = usePage().props;
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage, setEventsPerPage] = useState(10);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');

    // Ensure evenements is always an array
    const events = Array.isArray(evenements) ? evenements : [];
    console.log('Processed events:', events);

    // Initialiser les évaluations au chargement du composant
    useEffect(() => {
        if (auth?.user && Array.isArray(evenements)) {
            const newUserRatings = {};
            const newAverageRatings = {};

            evenements.forEach(evenement => {
                if (evenement?.evaluations && evenement.evaluations[auth.user.id]) {
                    newUserRatings[evenement.id_evenement] = evenement.evaluations[auth.user.id];
                }
                if (evenement?.average_rating) {
                    newAverageRatings[evenement.id_evenement] = parseFloat(evenement.average_rating);
                }
            });

            setUserRatings(newUserRatings);
            setAverageRatings(newAverageRatings);
        }
    }, [evenements, auth?.user]);

    useEffect(() => {
        if (flash?.success) {
            const { averageRating, evaluations, evenementId } = flash;
            if (evenementId) {
                setAverageRatings(prev => ({
                    ...prev,
                    [evenementId]: parseFloat(averageRating) || 0
                }));
                if (auth?.user && evaluations?.[auth.user.id]) {
                    setUserRatings(prev => ({
                        ...prev,
                        [evenementId]: evaluations[auth.user.id]
                    }));
                }
            }
        }
    }, [flash, auth?.user]);

    const handleRating = (id, rating) => {
        if (!auth?.user) {
            alert('Vous devez être connecté pour évaluer un événement');
            return;
        }

        // Mettre à jour immédiatement l'interface utilisateur
        setUserRatings(prev => ({
            ...prev,
            [id]: rating
        }));

        router.post(route('evaluations.store', { id_evenement: id }), {
            note: rating
        }, {
            preserveScroll: true,
            onSuccess: (response) => {
                if (response.props.flash?.success) {
                    const { averageRating, evaluations, evenementId } = response.props.flash;
                    setAverageRatings(prev => ({
                        ...prev,
                        [evenementId]: parseFloat(averageRating) || 0
                    }));
                }
            },
            onError: (errors) => {
                console.error('Erreur lors de l\'évaluation:', errors);
                alert('Une erreur est survenue lors de l\'évaluation');
                // En cas d'erreur, revenir à l'état précédent
                setUserRatings(prev => ({
                    ...prev,
                    [id]: prev[id] || 0
                }));
            }
        });
    };

    const renderStars = (id) => {
        if (!id) return null;
        
        const userRating = userRatings?.[id] || 0;
        const averageRating = parseFloat(averageRatings?.[id]) || 0;
        const stars = [1, 2, 3, 4, 5];
        
        return (
            <div className="flex items-center space-x-2">
                <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-gray-600">
                        {averageRating.toFixed(1)}/5
                    </span>
                </div>
                {auth?.user && (
                    <div className="flex items-center space-x-1">
                        {stars.map((star) => (
                            <button
                                key={star}
                                onClick={() => handleRating(id, star)}
                                className="focus:outline-none"
                            >
                                {star <= userRating ? (
                                    <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                                ) : (
                                    <StarIcon className="h-5 w-5 text-yellow-400" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderEvenement = (evenement) => {
        if (!evenement || !evenement.id_evenement) return null;

    return (
                            <div key={evenement.id_evenement} className="bg-white border border-app-light-pink rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {evenement.titre}
                                        </h2>
                                        {auth?.user && (
                                            <FavoriButton
                                                evenementId={evenement.id_evenement}
                                                initialIsFavori={Array.isArray(favoris) ? favoris.includes(evenement.id_evenement) : false}
                                            />
                                        )}
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <CalendarIcon className="h-5 w-5 text-app-light-pink" />
                                            <span>{new Date(evenement.date_debut).toLocaleDateString('fr-FR', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <MapPinIcon className="h-5 w-5 text-app-light-pink" />
                                            <span>{evenement.lieu}</span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <ClockIcon className="h-5 w-5 text-app-light-pink" />
                                            <span>{evenement.duree} minutes</span>
                                        </div>

                                        <div className="mt-4">
                                            {renderStars(evenement.id_evenement)}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <Link
                                            href={route('evenements.show', evenement.id_evenement)}
                                            className="px-4 py-2 bg-app-light-pink text-gray-900 rounded-md hover:bg-app-pink-medium transition-colors"
                                        >
                                            Voir détails
                                        </Link>
                        {auth?.user?.role === 'organisateur' && (
                                            <Link
                                                href={route('evenements.edit', evenement.id_evenement)}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 font-medium"
                                            >
                                                Modifier
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
        );
    };

    const renderEvents = () => {
        try {
            console.log('Rendering events with:', {
                events,
                currentPage,
                eventsPerPage,
                startIndex: Math.max(0, (currentPage - 1) * eventsPerPage),
                endIndex: Math.min(events.length, (currentPage - 1) * eventsPerPage + eventsPerPage)
            });

            const startIndex = Math.max(0, (currentPage - 1) * eventsPerPage);
            const endIndex = Math.min(events.length, startIndex + eventsPerPage);
            
            const currentEvents = events.slice(startIndex, endIndex);
            console.log('Current events to render:', currentEvents);

            return currentEvents.map((event, index) => {
                if (!event) {
                    console.warn(`Event at index ${index} is undefined`);
                    return null;
                }

                const eventDate = event.date_evenement ? new Date(event.date_evenement) : null;
                const formattedDate = eventDate ? eventDate.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }) : 'Date non définie';

                const formattedTime = eventDate ? eventDate.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                }) : 'Heure non définie';

                return (
                    <div key={event.id || index} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {event.titre || 'Sans titre'}
                                    </h3>
                                    <p className="text-gray-600 mb-2">
                                        {event.description || 'Aucune description'}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                    <span className="font-medium">Date:</span> {formattedDate}
                                </div>
                                <div>
                                    <span className="font-medium">Heure:</span> {formattedTime}
                                </div>
                                <div>
                                    <span className="font-medium">Lieu:</span> {event.lieu || 'Non spécifié'}
                                </div>
                                <div>
                                    <span className="font-medium">Capacité:</span> {event.capacite || 'Non spécifiée'}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }).filter(Boolean);
        } catch (error) {
            console.error('Error rendering events:', error);
            return [];
        }
    };

    const renderPagination = () => {
        try {
            if (!Array.isArray(events) || events.length === 0) {
                return null;
            }

            const totalPages = Math.ceil(events.length / eventsPerPage);
            if (totalPages <= 1) {
                return null;
            }

            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-1 rounded ${
                            currentPage === i
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {i}
                    </button>
                );
            }

            return (
                <div className="flex justify-center space-x-2 mt-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Précédent
                    </button>
                    {pages}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Suivant
                    </button>
                </div>
            );
        } catch (error) {
            console.error('Error rendering pagination:', error);
            return null;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Événements" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Événements</h1>
                        {auth?.user && auth.user.role === 'organisateur' && (
                            <Link
                                href={route('evenements.create')}
                                className="inline-flex items-center px-6 py-3 bg-app-light-pink text-gray-900 rounded-lg font-semibold hover:bg-app-pink-medium transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                Créer un événement
                            </Link>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(evenements) && evenements.map(renderEvenement)}
                    </div>

                    {evenements.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                Aucun événement trouvé
                            </p>
                        </div>
                    )}

                    {renderEvents()}
                    {renderPagination()}
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 