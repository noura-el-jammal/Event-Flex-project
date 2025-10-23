import React, { useEffect } from 'react';
import { Link, router, Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Calendrier from './Calendrier';
import EventLocationMap from '@/Components/EventLocationMap';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon, 
  UserIcon,
  ChatBubbleLeftIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function Detail({ evenement, programmes }) {
  const { auth } = usePage().props;
  const dateEvenement = evenement?.date_debut?.slice(0, 10);

  // Log pour déboguer
  useEffect(() => {
    console.log('Evenement:', evenement);
    console.log('Auth:', auth);
  }, [evenement, auth]);

  const handleContactOrganizer = (e) => {
    e.preventDefault();
    
    // Log pour déboguer
    console.log('Evenement:', evenement);
    console.log('Auth:', auth);
    
    // Vérification plus stricte de l'événement et de son ID
    if (!evenement || !evenement.id_evenement) {
        console.error('ID de l\'événement non défini:', evenement);
        alert('Impossible de démarrer la conversation : informations de l\'événement manquantes');
        return;
    }
    
    try {
        router.get(route('chat.start-conversation', evenement.id_evenement), {}, {
            onSuccess: () => {
                console.log('Redirection réussie vers la conversation');
            },
            onError: (errors) => {
                console.error('Erreur lors de la redirection:', errors);
                alert('Une erreur est survenue lors de l\'ouverture de la conversation');
            }
        });
    } catch (error) {
        console.error('Erreur lors de la redirection:', error);
        alert('Une erreur est survenue lors de l\'ouverture de la conversation');
    }
  };

  // Vérifier si l'événement existe
  if (!evenement) {
    return (
      <AuthenticatedLayout>
        <Head title="Détails de l'événement" />
        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <p className="text-gray-500">Événement non trouvé</p>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Head title={evenement?.titre || 'Détails de l\'événement'} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* En-tête de l'événement */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6 text-gray-900">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{evenement.titre}</h1>
                {auth.user && auth.user.role === 'organisateur' && (
                  <Link
                    href={route('programmes.create', evenement.id_evenement)}
                    className="inline-flex items-center px-4 py-2 bg-app-light-pink hover:bg-app-pink-medium text-white rounded-lg transition-colors duration-200"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Ajouter un programme
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Contenu principal en deux colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne de gauche - Calendrier */}
            <div className="lg:col-span-2">
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <Calendrier programmes={programmes} dateEvenement={dateEvenement} />
                </div>
              </div>
            </div>

            {/* Colonne de droite - Informations et carte */}
            <div className="space-y-6">
              {/* Carte d'informations */}
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Informations</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                      <span>{new Date(evenement.date_debut).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPinIcon className="h-5 w-5 text-blue-600" />
                      <span>{evenement.lieu}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <ClockIcon className="h-5 w-5 text-blue-600" />
                      <span>{evenement.duree} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                      <span>Organisé par {evenement.organisateur?.name}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {auth.user?.role === 'participants' && evenement?.id_evenement && (
                      <button
                        onClick={handleContactOrganizer}
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-500 border border-transparent rounded-lg font-semibold text-white hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                      >
                        <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                        Contacter l'organisateur
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Carte de localisation */}
              {(evenement.latitude != null && evenement.longitude != null) && (
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                      <MapPinIcon className="h-6 w-6 text-blue-600" />
                      <span>Emplacement</span>
                    </h2>
                    <div className="h-[300px] rounded-lg overflow-hidden shadow-lg">
                      <EventLocationMap latitude={evenement.latitude} longitude={evenement.longitude} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
