import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ParticipantsIndex({ auth, evenementsOrganises, participantsParEvenement }) {
    const [selectedEvenement, setSelectedEvenement] = useState(null);

    const handleEvenementChange = (e) => {
        const evenementId = e.target.value;
        setSelectedEvenement(evenementId ? evenementsOrganises.find(e => e.id_evenement == evenementId) : null);
    };

    const currentParticipants = selectedEvenement ? participantsParEvenement[selectedEvenement.id_evenement] || [] : [];

    const { delete: inertiaDelete } = useForm();

    const handleDelete = (userId) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce participant de l\'événement ?')) {
            inertiaDelete(route('evenements.participants.destroy', { evenement: selectedEvenement.id_evenement, user: userId }), {
                onSuccess: () => {
                    alert('Participant supprimé avec succès.');
                    // Optionally, refresh the page or update state
                },
                onError: (errors) => {
                    alert('Erreur lors de la suppression du participant.');
                    console.error(errors);
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Participants</h2>}
        >
            <Head title="Gérer les Participants" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900">Sélectionner un événement</h3>
                            <select
                                onChange={handleEvenementChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                defaultValue=""
                            >
                                <option value="" disabled>Sélectionner un événement</option>
                                {evenementsOrganises.map((evenement) => (
                                    <option key={evenement.id_evenement} value={evenement.id_evenement}>
                                        {evenement.titre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedEvenement && (
                            <div className="p-6 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Participants pour "{selectedEvenement.titre}"</h3>
                                    <Link
                                        href={route('evenements.participants.create', { evenement: selectedEvenement.id_evenement })}
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Ajouter un Participant
                                    </Link>
                                </div>

                                {currentParticipants.length > 0 ? (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {currentParticipants.map((participant) => (
                                                <tr key={participant.id_utilisateur}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{participant.nom_utilisateur}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.role_dans_evenement}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={route('evenements.participants.update', { evenement: selectedEvenement.id_evenement, user: participant.id_utilisateur })}
                                                            method="put"
                                                            as="button"
                                                            data={{ rôle_dans_evenement: participant.role_dans_evenement === 'Intervenant' ? 'Participant' : 'Intervenant' }}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                        >
                                                            Changer le Rôle
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(participant.id_utilisateur)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>Aucun participant pour cet événement. <Link href={route('evenements.participants.create', { evenement: selectedEvenement.id_evenement })} className="text-indigo-600 hover:text-indigo-900">Ajouter un participant</Link></p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 