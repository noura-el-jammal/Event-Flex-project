import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline'; // Using Heroicons as previously installed
import LeafletMap from '@/Pages/Evenement/LeafletMap';

export default function EventSearchBar({
  onSearch, // Function to call when search is triggered
  initialSearchTerm = '',
  initialLocation = '',
  initialCoordinates = null,
}) {
  const [key, setKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  // Mettre à jour les états initiaux si les props changent
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
    setLocation(initialLocation);
    setCoordinates(initialCoordinates);
  }, [initialSearchTerm, initialLocation, initialCoordinates]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      const searchParams = {
        searchTerm,
        location,
      };

      if (coordinates && coordinates.lat && coordinates.lng) {
        searchParams.coordinates = coordinates;
      }

      console.log('Search params:', searchParams);
      onSearch(searchParams);
      
      // Réinitialiser tous les champs
      setSearchTerm('');
      setLocation('');
      setCoordinates(null);
      setShowMap(false);
      setKey(prev => prev + 1);
    }
  };

  const handleLocationSelect = ({ lat, lng, address }) => {
    console.log('Location selected:', { lat, lng, address });
    setLocation(address);
    setCoordinates({ lat, lng });
    setShowMap(false);
  };

  const handleLocationInputChange = (e) => {
    setLocation(e.target.value);
    setCoordinates(null);
  };

  return (
    <div key={key} className="bg-app-pink-lighter py-6 shadow-lg rounded-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-grow w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-app-pink-medium" />
            </div>
            <input
              type="text"
              placeholder="Rechercher des événements"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-app-pink-light rounded-lg focus:outline-none focus:ring-2 focus:ring-app-pink-medium focus:border-app-pink-medium transition-all duration-300"
            />
          </div>

          <div className="relative flex-grow w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MapPinIcon className="h-5 w-5 text-app-pink-medium" />
            </div>
            <input
              type="text"
              placeholder="Lieu"
              value={location}
              onChange={handleLocationInputChange}
              onFocus={() => setShowMap(true)}
              className="w-full pl-10 pr-3 py-3 border border-app-pink-light rounded-lg focus:outline-none focus:ring-2 focus:ring-app-pink-medium focus:border-app-pink-medium transition-all duration-300"
            />
            {showMap && (
              <div className="absolute z-20 mt-2 w-full max-h-60 overflow-y-auto bg-white p-2 rounded-lg shadow-xl border border-app-pink-light">
                  <LeafletMap onLocationSelect={handleLocationSelect} />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-app-pink-dark text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-app-pink-medium focus:outline-none focus:ring-2 focus:ring-app-pink-dark focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
          >
            Rechercher
          </button>
        </form>
      </div>
    </div>
  );
} 