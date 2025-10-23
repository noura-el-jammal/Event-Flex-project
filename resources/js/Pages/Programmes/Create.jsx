import { useState } from 'react';
import { router, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CreateProgramme({ auth, evenement }) {
    const [nombre, setNombre] = useState(1);
    const [programmes, setProgrammes] = useState([{ 
        titre_activite: '', 
        heure_debut: '', 
        heure_fin: '',
        ressources: []
    }]);

    const form = useForm({
        programmes: programmes
    });

    const handleChangeNombre = (e) => {
        const n = parseInt(e.target.value);
        setNombre(n);

        const nouveauxProgrammes = Array.from({ length: n }, (_, i) => programmes[i] || {
            titre_activite: '',
            heure_debut: '',
            heure_fin: '',
            ressources: []
        });
        setProgrammes(nouveauxProgrammes);
        form.setData('programmes', nouveauxProgrammes);
    };

    const handleChange = (i, field, value) => {
        const copie = [...programmes];
        copie[i][field] = value;
        setProgrammes(copie);
        form.setData('programmes', copie);
    };

    const handleFileChange = (i, e) => {
        const files = Array.from(e.target.files);
        
        // Vérifier la taille de chaque fichier (10MB max)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en bytes
        const invalidFiles = files.filter(file => file.size > MAX_FILE_SIZE);
        
        if (invalidFiles.length > 0) {
            alert(`Les fichiers suivants dépassent la taille maximale de 10MB : ${invalidFiles.map(f => f.name).join(', ')}`);
            return;
        }

        const copie = [...programmes];
        copie[i].ressources = files;
        setProgrammes(copie);
        form.setData('programmes', copie);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Début de la soumission du formulaire');
        
        // Validation des données
        const programmesValides = programmes.every(prog => 
            prog.titre_activite && 
            prog.heure_debut && 
            prog.heure_fin && 
            prog.heure_fin > prog.heure_debut 
        );

        if (!programmesValides) {
            alert('Veuillez remplir tous les champs et vérifier que l\'heure de fin est après l\'heure de début');
            return;
        }

        // Vérifier la taille totale des fichiers
        const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB en bytes
        let totalSize = 0;
        
        programmes.forEach(prog => {
            prog.ressources.forEach(file => {
                totalSize += file.size;
            });
        });

        if (totalSize > MAX_TOTAL_SIZE) {
            alert(`La taille totale des fichiers (${(totalSize / (1024 * 1024)).toFixed(2)}MB) dépasse la limite de 50MB`);
            return;
        }

        // Préparer les données pour l'envoi
        const formData = new FormData();

        programmes.forEach((programme, index) => {
            // Ajouter les champs de base
            formData.append(`programmes[${index}][titre_activite]`, programme.titre_activite);
            formData.append(`programmes[${index}][heure_debut]`, programme.heure_debut);
            formData.append(`programmes[${index}][heure_fin]`, programme.heure_fin);

            // Ajouter les fichiers s'ils existent
            if (programme.ressources && programme.ressources.length > 0) {
                programme.ressources.forEach((file, fileIndex) => {
                    formData.append(`programmes[${index}][ressources][]`, file);
                });
            }
        });

        console.log('Données à envoyer:', programmes);

        // Envoyer les données
        router.post(route('programmes.store', evenement.id_evenement), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setProgrammes([{ 
                    titre_activite: '', 
                    heure_debut: '', 
                    heure_fin: '',
                    ressources: []
                }]);
                setNombre(1);
            },
            onError: (errors) => {
                console.error('Erreur lors de l\'enregistrement:', errors);
                let errorMessage = 'Une erreur est survenue lors de l\'enregistrement des programmes:\n';
                
                if (typeof errors === 'object') {
                    Object.entries(errors).forEach(([key, value]) => {
                        errorMessage += `\n${key}: ${value}`;
                    });
                } else {
                    errorMessage += errors;
                }
                
                alert(errorMessage);
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="p-4 max-w-3xl mx-auto">
                <h1 className="text-xl font-bold mb-4">Ajouter plusieurs programmes</h1>

                <div className="mb-4">
                    <label className="block font-semibold">Nombre de programmes</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={nombre}
                        onChange={handleChangeNombre}
                        className="border p-2 rounded"
                    />
                </div>

                <form onSubmit={handleSubmit}>
                    {programmes.map((prog, i) => (
                        <div key={i} className="border p-4 mb-4 rounded shadow">
                            <h2 className="font-semibold mb-2">Programme {i + 1}</h2>

                            {/* titre_activite Section */}
                            <div className="mb-4">
                                <label className="block font-semibold mb-1">titre_activite de l'activité</label>
                                <input
                                    type="text"
                                    placeholder="titre_activite de l'activité"
                                    value={prog.titre_activite}
                                    onChange={e => handleChange(i, 'titre_activite', e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>

                            {/* Date and Time Section */}
                            <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
                                <div className="flex items-start">
                                    <div className="flex flex-col items-center mr-4">
                                        <div className="w-3 h-3 bg-blue-600 rounded-full mb-1"></div>
                                        <div className="w-px h-8 bg-blue-300"></div>
                                        <div className="w-3 h-3 border-2 border-blue-600 rounded-full mt-1"></div>
                                    </div>
                                    <div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700 text-sm font-semibold mb-1">Début</label>
                                            <div className="flex items-center space-x-2">
                                              
                                                <input
                                                    type="time"
                                                    value={prog.heure_debut}
                                                    onChange={e => handleChange(i, 'heure_debut', e.target.value)}
                                                    className="border rounded px-2 py-1 text-sm"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-1">Fin</label>
                                            <div className="flex items-center space-x-2">
                                              
                                                <input
                                                    type="time"
                                                    value={prog.heure_fin}
                                                    onChange={e => handleChange(i, 'heure_fin', e.target.value)}
                                                    className="border rounded px-2 py-1 text-sm"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Timezone Placeholder */}
                                <div className="text-right text-gray-600">
                                    <p className="text-xs mb-1">GMT+01:00</p>
                                    <p className="text-xs">Casablanca</p>
                                </div>
                            </div>
                            
                            {/* Section des ressources */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ressources (images, vidéos, documents)
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => handleFileChange(i, e)}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                />
                                {prog.ressources.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">
                                            {prog.ressources.length} fichier(s) sélectionné(s)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Enregistrer les programmes
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
