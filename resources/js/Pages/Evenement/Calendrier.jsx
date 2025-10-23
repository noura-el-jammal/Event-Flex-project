import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { router, Link } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  XMarkIcon, 
  DocumentIcon, 
  PhotoIcon, 
  VideoCameraIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import frLocale from '@fullcalendar/core/locales/fr';
import axios from 'axios';

export default function Calendrier({ programmes, dateEvenement }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedStartTime, setEditedStartTime] = useState('');
  const [editedEndTime, setEditedEndTime] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Mettre à jour les événements quand les programmes changent
    setEvents(programmes.map(programme => {
      // S'assurer que les heures sont au format HH:mm
      const heure_debut = programme.heure_debut.padStart(5, '0');
      const heure_fin = programme.heure_fin.padStart(5, '0');
      
      return {
        id: programme.id_Programme,
        title: programme.titre_activite,
        start: `${dateEvenement}T${heure_debut}:00`,
        end: `${dateEvenement}T${heure_fin}:00`,
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        textColor: '#FFFFFF',
        extendedProps: {
          titre_activite: programme.titre_activite,
          ressources: programme.ressources || []
        }
      };
    }));
  }, [programmes, dateEvenement]);

  const handleEventDrop = (info) => {
    router.put(route('programmes.update', info.event.id), {
      titre_activite: info.event.title,
      heure_debut: info.event.start.toTimeString().slice(0, 5),
      heure_fin: info.event.end.toTimeString().slice(0, 5)
    }, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (response) => {
        // Mettre à jour l'état local avec les données du serveur
            setEvents(prevEvents => 
              prevEvents.map(event => 
            event.id === info.event.id 
                  ? {
                      ...event,
                  title: response.programme.titre_activite,
                      start: `${dateEvenement}T${response.programme.heure_debut}:00`,
                      end: `${dateEvenement}T${response.programme.heure_fin}:00`,
                      extendedProps: {
                        ...event.extendedProps,
                        titre_activite: response.programme.titre_activite
                      }
                    }
                  : event
              )
            );
        },
        onError: (errors) => {
        console.error('Erreur lors de la mise à jour:', errors);
        alert(errors.message || 'Une erreur est survenue lors de la mise à jour');
          info.revert();
      }
    });
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setEditedTitle(info.event.extendedProps.titre_activite);
    setEditedStartTime(info.event.start.toTimeString().substring(0, 5));
    setEditedEndTime(info.event.end.toTimeString().substring(0, 5));
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editedTitle || !editedStartTime || !editedEndTime) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    router.put(route('programmes.update', selectedEvent.id), {
      titre_activite: editedTitle,
        heure_debut: editedStartTime,
      heure_fin: editedEndTime
    }, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (response) => {
        // Mettre à jour l'état local avec les données du serveur
            setEvents(prevEvents => 
              prevEvents.map(event => 
                event.id === selectedEvent.id 
                  ? {
                      ...event,
                  title: response.programme.titre_activite,
                  start: `${dateEvenement}T${response.programme.heure_debut}:00`,
                  end: `${dateEvenement}T${response.programme.heure_fin}:00`,
                      extendedProps: {
                        ...event.extendedProps,
                    titre_activite: response.programme.titre_activite
                      }
                    }
                  : event
              )
            );
            setIsEditing(false);
        setIsModalOpen(false);
        },
        onError: (errors) => {
        console.error('Erreur lors de la mise à jour:', errors);
        alert(errors.message || 'Une erreur est survenue lors de la mise à jour');
      }
    });
  };

  const handleDelete = () => {
    if (confirm(`Supprimer "${selectedEvent.title}" ?`)) {
      router.delete(route('programmes.destroy', selectedEvent.id), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          // Mettre à jour l'état local
          setEvents(prevEvents => prevEvents.filter(event => event.id !== selectedEvent.id));
            setIsModalOpen(false);
        },
        onError: (errors) => {
          console.error('Erreur lors de la suppression:', errors);
          alert(errors.message || 'Une erreur est survenue lors de la suppression');
        }
      });
    }
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return <PhotoIcon className="h-6 w-6 text-blue-600" />;
    } else if (['mp4', 'webm', 'mov'].includes(extension)) {
      return <VideoCameraIcon className="h-6 w-6 text-red-600" />;
    } else {
      return <DocumentIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('programme_id', selectedEvent.id);

    router.post(route('ressources.store'), formData, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (response) => {
        if (response.success) {
          // Mettre à jour les ressources dans l'événement
          setEvents(prevEvents => 
            prevEvents.map(event => 
              event.id === selectedEvent.id 
                ? {
                    ...event,
                    extendedProps: {
                      ...event.extendedProps,
                      ressources: [...(event.extendedProps.ressources || []), response.ressource]
                    }
                  }
                : event
            )
          );
          setSelectedFile(null);
        } else {
          alert(response.message || 'Erreur lors du téléchargement');
        }
        setUploading(false);
      },
      onError: (errors) => {
        alert(errors.message || 'Erreur lors du téléchargement');
        setUploading(false);
      }
    });
  };

  const handleDeleteRessource = (ressourceId) => {
    if (confirm('Voulez-vous vraiment supprimer cette ressource ?')) {
      router.delete(route('ressources.destroy', ressourceId), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (response) => {
          if (response.success) {
            // Mettre à jour les ressources dans l'événement
            setEvents(prevEvents => 
              prevEvents.map(event => 
                event.id === selectedEvent.id 
                  ? {
                      ...event,
                      extendedProps: {
                        ...event.extendedProps,
                        ressources: event.extendedProps.ressources.filter(r => r.id_Ressource !== ressourceId)
                      }
                    }
                  : event
              )
            );
          } else {
            alert(response.message || 'Erreur lors de la suppression');
          }
        },
        onError: (errors) => {
          alert(errors.message || 'Erreur lors de la suppression');
        }
      });
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Programme de la journée</h2>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
          initialView="timeGridDay"
          initialDate={dateEvenement}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek'
          }}
          events={events}
          editable={true}
          droppable={true}
          eventDrop={handleEventDrop}
          eventClick={handleEventClick}
          allDaySlot={false}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          locale={frLocale}
          slotDuration="00:30:00"
          slotLabelInterval="01:00"
          nowIndicator={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          eventClassNames="cursor-pointer hover:opacity-90 transition-opacity"
          dayHeaderClassNames="bg-gray-50 font-semibold"
          slotLabelClassNames="text-gray-600 font-medium"
          nowIndicatorClassNames="bg-red-500"
          eventBackgroundColor="#3B82F6"
          eventBorderColor="#2563EB"
          eventTextColor="#FFFFFF"
          dayMaxEvents={true}
          expandRows={true}
          stickyHeaderDates={true}
          dayHeaderFormat={{ weekday: 'long', day: 'numeric', month: 'long' }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          views={{
            timeGridDay: {
              titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
            },
            timeGridWeek: {
              titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
            }
          }}
          buttonText={{
            today: "Aujourd'hui",
            day: 'Jour',
            week: 'Semaine'
          }}
        />
      </div>

      {/* Modal pour afficher les détails et ressources */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-start">
                    {isEditing ? (
                      <div className="flex-1">
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="w-full text-lg font-medium text-gray-900 border-b-2 border-blue-500 focus:outline-none focus:border-blue-600"
                          placeholder="Titre de l'activité"
                        />
                        <div className="mt-4 flex space-x-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Heure de début</label>
                            <input
                              type="time"
                              value={editedStartTime}
                              onChange={(e) => setEditedStartTime(e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Heure de fin</label>
                            <input
                              type="time"
                              value={editedEndTime}
                              onChange={(e) => setEditedEndTime(e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        {selectedEvent?.title}
                      </Dialog.Title>
                    )}
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mt-4">
                    {isEditing ? (
                      <div className="space-y-6">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="w-full text-lg font-medium text-gray-900 border-b-2 border-blue-500 focus:outline-none focus:border-blue-600"
                            placeholder="Titre de l'activité"
                          />
                          <div className="mt-4 flex space-x-4">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700">Heure de début</label>
                              <input
                                type="time"
                                value={editedStartTime}
                                onChange={(e) => setEditedStartTime(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700">Heure de fin</label>
                              <input
                                type="time"
                                value={editedEndTime}
                                onChange={(e) => setEditedEndTime(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section des ressources */}
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Ressources</h4>
                          <div className="space-y-4">
                            {/* Liste des ressources existantes */}
                            {selectedEvent?.extendedProps?.ressources?.length > 0 && (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {selectedEvent.extendedProps.ressources.map((ressource, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                      {getFileIcon(ressource.url_fichier)}
                                      <span className="ml-2 text-sm text-gray-600 truncate">
                                        {ressource.url_fichier.split('/').pop()}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleDeleteRessource(ressource.id_Ressource)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <TrashIcon className="h-5 w-5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Formulaire d'ajout de ressource */}
                            <div className="flex items-center space-x-4">
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
                              <button
                                onClick={handleUpload}
                                disabled={!selectedFile || uploading}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {uploading ? (
                                  'Téléchargement...'
                                ) : (
                                  <>
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Ajouter
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={handleSave}
                          >
                            Enregistrer
                          </button>
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                            onClick={() => setIsEditing(false)}
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <ClockIcon className="h-5 w-5" />
                          <span>
                            De {selectedEvent?.start?.toLocaleTimeString()} à {selectedEvent?.end?.toLocaleTimeString()}
                          </span>
                        </div>

                        {selectedEvent?.extendedProps?.ressources?.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Ressources</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {selectedEvent.extendedProps.ressources.map((ressource, index) => (
                                <a
                                  key={index}
                                  href={route('ressources.show', ressource.id_Ressource)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  {getFileIcon(ressource.url_fichier)}
                                  <span className="ml-2 text-sm text-gray-600 truncate">
                                    {ressource.url_fichier.split('/').pop()}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={handleEdit}
                          >
                            <PencilIcon className="h-5 w-5 mr-2" />
                            Modifier
                          </button>
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            onClick={handleDelete}
                          >
                            <TrashIcon className="h-5 w-5 mr-2" />
                            Supprimer
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
