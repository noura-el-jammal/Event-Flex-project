import './bootstrap';
import '../css/app.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { ZiggyVue } from '../../vendor/tightenco/ziggy/dist/vue.m';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Créez une fonction pour gérer la racine React
const initializeApp = () => {
    let root = null;

    return createInertiaApp({
        title: (title) => `${title} - ${appName}`,
        resolve: (name) => {
            return resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob(['./Pages/**/*.jsx', './Pages/**/*.tsx']));
        },
        setup({ el, App, props }) {
            if (!root) {
                root = createRoot(el);
            }
            root.render(<App {...props} />);
        },
        progress: {
            color: '#4B5563',
        },
    });
};

// Initialisez l'application
initializeApp();

// Configuration CSRF pour Inertia
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

export default function ProgrammeDetail({ auth, programme, evenement }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [ressources, setRessources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRessources();
  }, [programme.id_Programme]);

  const fetchRessources = async () => {
    try {
      const response = await axios.get(`/api/programmes/${programme.id_Programme}/ressources`);
      setRessources(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources:', error);
    }
  };

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
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        await axios.post(`/api/programmes/${programme.id_Programme}/ressources`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        setSelectedFile(null);
        setPreviewUrl(null);
        await fetchRessources(); // Rafraîchir la liste des ressources
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la ressource:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteRessource = async (ressourceId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
      try {
        await axios.delete(`/api/ressources/${ressourceId}`);
        await fetchRessources(); // Rafraîchir la liste des ressources
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

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
          Votre navigateur ne supporte pas la lecture de cette vidéo.
        </video>
      );
    }
  };

  return (
    <AuthenticatedLayout>
      {/* Rest of the component content */}
      {auth?.user?.role === 'participants' && (
        <button
          onClick={() => {
            router.visit(route('messages', {
              user: evenement.organisateur.id
            }));
          }}
          className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
        >
          <ChatBubbleLeftIcon className="h-5 w-5" />
          <span>Contacter l'organisateur</span>
        </button>
      )}
    </AuthenticatedLayout>
  );
}
