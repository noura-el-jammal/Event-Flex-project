import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function CreateParticipant({ auth, evenement, users }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        id_evenement: evenement.id_evenement,
        id_utilisateur: '',
        rôle_dans_evenement: 'Participant', // Default role
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('evenements.participants.store', { evenement: evenement.id_evenement }), {
            onSuccess: () => {
                alert('Participant ajouté avec succès !');
                reset('id_utilisateur'); // Reset the user selection after success
            },
            onError: (formErrors) => {
                console.error('Erreur lors de l\'ajout du participant:', formErrors);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Inviter un Participant à "{evenement.titre}"</h2>}
        >
            <Head title={`Inviter un Participant à ${evenement.titre}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <input type="hidden" value={evenement.id_evenement} />

                            <div className="mb-4">
                                <InputLabel htmlFor="user_select" value="Sélectionner un utilisateur" />
                                <select
                                    id="user_select"
                                    name="id_utilisateur"
                                    value={data.id_utilisateur}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    onChange={(e) => setData('id_utilisateur', e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Choisissez un utilisateur</option>
                                    {users.map((userOption) => (
                                        <option key={userOption.id} value={userOption.id}>
                                            {userOption.name} ({userOption.email})
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.id_utilisateur} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="role_select" value="Rôle dans l'événement" />
                                <select
                                    id="role_select"
                                    name="rôle_dans_evenement"
                                    value={data.rôle_dans_evenement}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    onChange={(e) => setData('rôle_dans_evenement', e.target.value)}
                                    required
                                >
                                    <option value="Participant">Participant</option>
                                    <option value="Intervenant">Intervenant</option>
                                </select>
                                <InputError message={errors.rôle_dans_evenement} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <PrimaryButton className="ms-4" disabled={processing}>
                                    Inviter
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 