import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function EventLocationMap({ latitude, longitude }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Si la carte existe déjà, ne la recrée pas.
    if (mapRef.current) {
      // Met à jour la position du marqueur si les coordonnées changent
      if (markerRef.current && latitude && longitude) {
        markerRef.current.setLatLng([latitude, longitude]);
        mapRef.current.setView([latitude, longitude], 13); // Centre la carte sur le marqueur
      }
      return;
    }

    // Coordonnées par défaut au cas où latitude ou longitude ne sont pas fournies
    const initialPosition = (latitude && longitude) ? [latitude, longitude] : [0, 0]; // Utiliser les coordonnées fournies ou un défaut
    const initialZoom = (latitude && longitude) ? 13 : 1; // Zoom plus large pour le défaut

    // Créer la carte
    const map = L.map('event-map').setView(initialPosition, initialZoom);
    mapRef.current = map;

    // Ajouter la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    // Ajouter un marqueur à la position donnée
    if (latitude && longitude) {
        markerRef.current = L.marker([latitude, longitude]).addTo(map);
    }

    // Nettoyer la carte lors du démontage du composant
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };

  }, [latitude, longitude]); // Dépendances de l'effet

  return <div id="event-map" className="h-80 w-full rounded border mt-4" />;
} 