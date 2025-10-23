import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import LeafletMap from './LeafletMap';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function EvenementCreate({ auth }) {
  const { data, setData, post, processing, errors } = useForm({
    titre: '',
    date_debut: '',
    heure_debut: '',
    lieu: '',
    latitude: '',
    longitude: '',
    address: '',
    duree: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation des champs obligatoires
    if (!data.titre) {
      alert('Veuillez entrer un titre pour l\'événement.');
      return;
    }
    if (!data.date_debut) {
      alert('Veuillez sélectionner une date de début.');
      return;
    }
    if (!data.heure_debut) {
      alert('Veuillez sélectionner une heure de début.');
      return;
    }
    if (!data.lieu) {
      alert('Veuillez sélectionner un lieu sur la carte.');
      return;
    }
    if (!data.duree) {
      alert('Veuillez entrer la durée de l\'événement.');
      return;
    }

    // Combiner la date et l'heure
    const dateTime = new Date(data.date_debut);
    const [hours, minutes] = data.heure_debut.split(':');
    dateTime.setHours(parseInt(hours), parseInt(minutes));

    // Mettre à jour la date avec l'heure
    setData('date_debut', dateTime.toISOString());

    post(route('evenements.store'), {
      ...data,
      date_debut: dateTime.toISOString()
    });
  };

  const handleLocationSelect = ({ lat, lng, address }) => {
    setData('latitude', lat);
    setData('longitude', lng);
    setData('address', address);
    setData('lieu', address);
  };

  return (
    <AuthenticatedLayout user={auth?.user}>
      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={handleSubmit} className="p-6 text-gray-900">
              {/* Titre de l'événement */}
              <div className="mb-8">
                <InputLabel htmlFor="titre" value="Nom de l'événement" />
                <TextInput
                  id="titre"
                  type="text"
                  name="titre"
                  value={data.titre}
                  className="mt-1 block w-full"
                  onChange={e => setData('titre', e.target.value)}
                  required
                />
                <InputError message={errors.titre} className="mt-2" />
              </div>

              {/* Date et Heure */}
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputLabel htmlFor="date_debut" value="Date de début" />
                    <TextInput
                      id="date_debut"
                      type="date"
                      name="date_debut"
                      value={data.date_debut}
                      className="mt-1 block w-full"
                      onChange={e => setData('date_debut', e.target.value)}
                      required
                    />
                    <InputError message={errors.date_debut} className="mt-2" />
                  </div>
                  <div>
                    <InputLabel htmlFor="heure_debut" value="Heure de début" />
                    <TextInput
                      id="heure_debut"
                      type="time"
                      name="heure_debut"
                      value={data.heure_debut}
                      className="mt-1 block w-full"
                      onChange={e => setData('heure_debut', e.target.value)}
                      required
                    />
                    <InputError message={errors.heure_debut} className="mt-2" />
                  </div>
                </div>
              </div>

              {/* Lieu */}
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-6">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">📍</span>
                  <h2 className="text-lg font-semibold text-gray-800">Lieu de l'événement</h2>
                </div>
                <InputLabel htmlFor="address" value="Adresse" />
                <TextInput
                  id="address"
                  type="text"
                  name="address"
                  value={data.address}
                  className="mt-1 block w-full bg-gray-100"
                  readOnly
                  required
                />
                <InputError message={errors.lieu} className="mt-2" />
                <div className="mt-4">
                  <LeafletMap onLocationSelect={handleLocationSelect} />
                </div>
              </div>

              {/* Durée */}
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-6">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">⏱️</span>
                  <h2 className="text-lg font-semibold text-gray-800">Durée de l'événement</h2>
                </div>
                <InputLabel htmlFor="duree" value="Durée (en minutes)" />
                <TextInput
                  id="duree"
                  type="number"
                  name="duree"
                  value={data.duree}
                  className="mt-1 block w-full"
                  onChange={e => setData('duree', e.target.value)}
                  min="1"
                  required
                />
                <InputError message={errors.duree} className="mt-2" />
              </div>

              {/* Bouton de soumission */}
              <div className="flex items-center justify-end mt-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                >
                  {processing ? 'Création en cours...' : 'Créer l\'événement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
