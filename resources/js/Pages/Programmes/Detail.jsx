import React, { useState, useEffect } from 'react';
import { useProgrammeStore } from '@/Stores/programmeStore';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ProgrammeDetail({ auth, programme, evenement }) {
  const programmeStore = useProgrammeStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    programmeStore.fetchProgrammes(evenement.id_evenement);
  }, [evenement.id_evenement]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      try {
        await programmeStore.addRessource(programme.id_Programme, selectedFile);
        setSelectedFile(null);
        setPreviewUrl(null);
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la ressource:', error);
      }
    }
  };

  const handleDeleteRessource = async (ressourceId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
      try {
        await programmeStore.deleteRessource(ressourceId);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const ressources = programmeStore.getRessourcesByProgramme(programme.id_Programme);

  const renderRessourcePreview = (ressource) => {
    const fileUrl = ressource.url_fichier;
    const fileType = fileUrl.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
      return (
        <img 
          src={fileUrl} 
          alt="Ressource" 
          className="w-full h-48 object-cover rounded-lg"
        />
      );
    } else if (['mp4', 'webm'].includes(fileType)) {
      return (
        <video 
          controls 
          className="w-full h-48 object-cover rounded-lg"
        >
          <source src={fileUrl} type={`video/${fileType}`} />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Télécharger le document
          </a>
        </div>
      );
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={`Programme - ${programme.titre_activite}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">{programme.titre_activite}</h1>
              
              <div className="mb-6">
                <p className="text-gray-600">
                  <span className="font-semibold">Heure de début:</span> {programme.heure_debut}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Heure de fin:</span> {programme.heure_fin}
                </p>
              </div>

              {/* Section des ressources */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Ressources</h2>
                
                {/* Formulaire d'ajout de ressource */}
                <form onSubmit={handleSubmit} className="mb-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ajouter une ressource
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                  
                  {previewUrl && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Aperçu:</p>
                      {selectedFile.type.startsWith('image/') ? (
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="max-h-48 rounded-lg"
                        />
                      ) : selectedFile.type.startsWith('video/') ? (
                        <video 
                          src={previewUrl} 
                          controls 
                          className="max-h-48 rounded-lg"
                        />
                      ) : (
                        <p className="text-sm text-gray-500">
                          {selectedFile.name}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!selectedFile}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Ajouter la ressource
                  </button>
                </form>

                {/* Liste des ressources */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ressources.map((ressource) => (
                    <div key={ressource.id_Ressource} className="border rounded-lg overflow-hidden">
                      {renderRessourcePreview(ressource)}
                      <div className="p-4">
                        <button
                          onClick={() => handleDeleteRessource(ressource.id_Ressource)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 