<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="app-url" content="{{ config('app.url') }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        <script>
            // Configuration globale pour Inertia
            window.Laravel = {
                csrfToken: '{{ csrf_token() }}',
                appUrl: '{{ config('app.url') }}'
            };

            // Configuration des routes
            window.routes = @json(\Illuminate\Support\Facades\Route::getRoutes()->getRoutesByName());

            // Configuration globale d'Inertia
            window.Inertia = {
                // Configuration des en-têtes par défaut
                defaults: {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }
            };
        </script>
    </body>
</html>
