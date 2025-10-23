import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    PencilIcon, 
    TrashIcon, 
    PhotoIcon,
    XMarkIcon,
    PlusIcon,
    UserCircleIcon,
    ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import Pagination from '@/Components/Pagination';

export default function Publications({ auth, evenement, publications, isOrganisateur, organisateurEvents }) {
    const [newPublication, setNewPublication] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [editingPublication, setEditingPublication] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showComments, setShowComments] = useState({});
    const [newComment, setNewComment] = useState({});
    const [selectedEventIdForNewPublication, setSelectedEventIdForNewPublication] = useState(evenement?.id_evenement || '');

    // Logs de débogage détaillés
    console.log('=== DÉTAILS DE DÉBOGAGE ===');
    console.log('Auth:', auth);
    console.log('User:', auth?.user);
    console.log('User Role:', auth?.user?.role);
    console.log('Evenement:', evenement);
    console.log('Is Organisateur:', isOrganisateur);
    console.log('Event ID:', evenement?.id_evenement);
    console.log('Organizer Events:', organisateurEvents);
    console.log('Selected Event ID for New Publication:', selectedEventIdForNewPublication);
    console.log('========================');

    // Vérification des données requises
    if (!auth?.user) {
        return (
            <AuthenticatedLayout>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <p className="text-red-600">Erreur : Données utilisateur manquantes</p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    console.log('User role:', auth.user?.role);
    console.log('Is organisateur:', isOrganisateur);
    console.log('Evenement:', evenement);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const eventIdToPost = evenement?.id_evenement || selectedEventIdForNewPublication;

        // Logs de débogage pour l'événement
        console.log('=== DÉTAILS DE L\'ÉVÉNEMENT ===');
        console.log('Evenement complet:', evenement);
        console.log('ID Événement à poster:', eventIdToPost);
        console.log('===========================');

        if (!eventIdToPost) {
            console.error('ID de l\'événement manquant pour la publication.');
            alert('Veuillez sélectionner un événement pour la publication.'); // Alert user
            return;
        }

        const formData = new FormData();
        formData.append('contenuP', newPublication);
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        // Log de la route
        console.log('Route de publication:', route('publications.store', eventIdToPost));

        router.post(route('publications.store', eventIdToPost), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setNewPublication('');
                setSelectedImage(null);
                setShowForm(false);
                setSelectedEventIdForNewPublication(evenement?.id_evenement || ''); // Reset selected event
            },
            onError: (errors) => {
                console.error('Erreur lors de la création de la publication:', errors);
            }
        });
    };

    const handleUpdate = (id) => {
        const formData = new FormData();
        formData.append('contenuP', editContent);
        formData.append('_method', 'PUT');
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        router.post(route('publications.update', id), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingPublication(null);
                setEditContent('');
                setSelectedImage(null);
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
            router.delete(route('publications.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const toggleComments = (publicationId) => {
        setShowComments(prev => ({
            ...prev,
            [publicationId]: !prev[publicationId]
        }));
    };

    const handleCommentSubmit = (publicationId) => {
        if (newComment[publicationId] && newComment[publicationId].trim()) {
            router.post(route('commentaires.store', { id_publication: publicationId }), {
                contenu: newComment[publicationId].trim()
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setNewComment({ ...newComment, [publicationId]: '' });
                    router.reload({ preserveScroll: true });
                }
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    {/* En-tête */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {evenement ? `Publications - ${evenement.titre}` : 'Toutes les publications'}
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Partagez et interagissez avec la communauté
                                </p>
                            </div>
                            {evenement?.id_evenement && (
                                <Link
                                    href={route('evenements.show', evenement.id_evenement)}
                                    className="text-app-light-pink hover:text-app-pink-medium transition-colors duration-300 flex items-center space-x-2"
                                >
                                    <span>Retour à l'événement</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Bouton d'ajout de publication */}
                    {auth.user.role === 'organisateur' && (
                        <div className="mb-8 flex justify-end">
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="inline-flex items-center px-6 py-3 bg-app-light-pink text-white rounded-lg shadow-lg hover:bg-app-pink-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                <span>{showForm ? 'Annuler' : 'Nouvelle publication'}</span>
                            </button>
                        </div>
                    )}
                    

                    {/* Formulaire de publication */}
                    {showForm && auth.user.role === 'organisateur' && (
                        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
                            <form onSubmit={handleSubmit}>
                                {/* Sélecteur d'événement si "Toutes les publications" */}
                                {!evenement && organisateurEvents && organisateurEvents.length > 0 && (
                                    <div className="mb-4">
                                        <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-2">
                                            Sélectionner un événement pour la publication :
                                        </label>
                                        <select
                                            id="event-select"
                                            value={selectedEventIdForNewPublication}
                                            onChange={(e) => setSelectedEventIdForNewPublication(e.target.value)}
                                            className="mt-1 block w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-app-pink-medium focus:border-transparent transition-all duration-300"
                                            required
                                        >
                                            <option value="">-- Choisir un événement --</option>
                                            {organisateurEvents.map((event) => (
                                                <option key={event.id_evenement} value={event.id_evenement}>
                                                    {event.titre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <textarea
                                        value={newPublication}
                                        onChange={(e) => setNewPublication(e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-app-pink-medium focus:border-transparent transition-all duration-300"
                                        rows="4"
                                        placeholder="Partagez quelque chose sur cet événement..."
                                        required
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <label className="cursor-pointer group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <PhotoIcon className="h-7 w-7 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                                        </label>
                                        {selectedImage && (
                                            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-full">
                                                <span className="text-sm text-gray-600">
                                                    {selectedImage.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedImage(null)}
                                                    className="text-gray-500 hover:text-red-500 transition-colors duration-300"
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-app-light-pink text-white rounded-full shadow-lg hover:bg-app-pink-medium transition-all duration-300 transform hover:scale-105"
                                    >
                                        Publier
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Liste des publications */}
                    <div className="space-y-6">
                        {publications?.data && publications.data.length > 0 ? (
                            publications.data.map((publication) => (
                                <div 
                                    key={`publication-${publication.id_publication}`} 
                                    className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl"
                                >
                                    {/* En-tête de la publication */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                                                {publication.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {publication.user.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(publication.date_publication).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                        </div>
                                        {auth.user.id === publication.id_utilisateur && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingPublication(publication.id_publication);
                                                        setEditContent(publication.contenuP);
                                                    }}
                                                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(publication.id_publication)}
                                                    className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-300"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Contenu de la publication */}
                                    {editingPublication === publication.id_publication ? (
                                        <div className="space-y-4">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                                rows="4"
                                                required
                                            />
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => {
                                                        setEditingPublication(null);
                                                        setEditContent('');
                                                    }}
                                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                                                >
                                                    Annuler
                                                </button>
                                                <button
                                                    onClick={() => handleUpdate(publication.id_publication)}
                                                    className="px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-all duration-300"
                                                >
                                                    Enregistrer
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="mb-4 text-gray-700 leading-relaxed">
                                                {publication.contenuP}
                                            </p>
                                            {publication.image_url && (
                                                <div className="mb-4 rounded-xl overflow-hidden">
                                                    <img
                                                        src={publication.image_url}
                                                        alt="Publication"
                                                        className="w-full h-auto object-cover transform transition-transform duration-300 hover:scale-105"
                                                    />
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
                                                <button 
                                                    onClick={() => toggleComments(publication.id_publication)}
                                                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors duration-300"
                                                >
                                                    <ChatBubbleLeftIcon className="h-6 w-6" />
                                                    <span>Commenter</span>
                                                </button>
                                            </div>

                                            {/* Section des commentaires */}
                                            {showComments[publication.id_publication] && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    {/* Liste des commentaires */}
                                                    {publication.commentaires && publication.commentaires.length > 0 ? (
                                                        <div className="space-y-4 mb-4">
                                                            {publication.commentaires.map((commentaire) => (
                                                                <div key={`comment-${commentaire.id}`} className="flex space-x-3">
                                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                                                                        {commentaire.user.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="bg-gray-50 rounded-2xl px-4 py-2">
                                                                            <div className="flex items-center justify-between">
                                                                                <h4 className="font-medium text-sm text-gray-900">
                                                                                    {commentaire.user.name}
                                                                                </h4>
                                                                                <p className="text-xs text-gray-500">
                                                                                    {new Date(commentaire.date_envoi).toLocaleDateString('fr-FR')}
                                                                                </p>
                                                                            </div>
                                                                            <p className="text-sm text-gray-700 mt-1">
                                                                                {commentaire.contenu}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 text-sm mb-4">
                                                            Aucun commentaire pour le moment
                                                        </p>
                                                    )}

                                                    {/* Formulaire de commentaire */}
                                                    <form 
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            handleCommentSubmit(publication.id_publication);
                                                        }}
                                                        className="flex space-x-2"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={newComment[publication.id_publication] || ''}
                                                            onChange={(e) => setNewComment({
                                                                ...newComment,
                                                                [publication.id_publication]: e.target.value
                                                            })}
                                                            placeholder="Écrivez un commentaire..."
                                                            className="flex-1 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                                            required
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
                                                        >
                                                            Envoyer
                                                        </button>
                                                    </form>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Aucune publication pour le moment</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {publications.links && (
                            <div className="mt-8">
                                <Pagination links={publications.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 