import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.axios = axios;
window.Pusher = Pusher;

// Configuration globale d'Axios
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;

// Configuration du token CSRF
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
    window.axios.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token.content);
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Configuration de l'URL de base
const appUrl = document.head.querySelector('meta[name="app-url"]');
if (appUrl) {
    window.axios.defaults.baseURL = appUrl.content;
}

// Debug: Afficher toutes les variables d'environnement
console.log('Toutes les variables d\'environnement:', import.meta.env);

// Récupération des variables d'environnement Pusher
const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;

// Vérification des variables d'environnement
if (!pusherKey || !pusherCluster) {
    console.error('Configuration Pusher manquante. Vérifiez votre fichier .env');
    console.log('VITE_PUSHER_APP_KEY:', pusherKey);
    console.log('VITE_PUSHER_APP_CLUSTER:', pusherCluster);
    console.log('Variables d\'environnement disponibles:', Object.keys(import.meta.env));
}

// Configuration de Laravel Echo
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: pusherKey,
    cluster: pusherCluster,
    forceTLS: true,
    enabledTransports: ['ws', 'wss']
});
