import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet/dist/leaflet.css';

export default function LeafletMap({ onLocationSelect }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;
const defaultPosition = [34.0331, -5.0003]; 

    const map = L.map('map').setView(defaultPosition, 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const marker = L.marker(defaultPosition, { draggable: true }).addTo(map);

    function updateAddress(lat, lng) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then((res) => res.json())
        .then((data) => {
          const address = data.display_name || `${lat}, ${lng}`;
          onLocationSelect({ lat, lng, address });
        });
    }

    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng();
      map.setView([lat, lng]);
      updateAddress(lat, lng);
    });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      updateAddress(lat, lng);
    });

    L.Control.geocoder({
      defaultMarkGeocode: false,
    })
      .on('markgeocode', function (e) {
        const { lat, lng } = e.geocode.center;
        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], 14);
        updateAddress(lat, lng);
      })
      .addTo(map);
  }, []);

  return <div id="map" className="h-64 w-full rounded border mt-2" />;
}
