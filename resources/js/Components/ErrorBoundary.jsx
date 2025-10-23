import React from 'react';
import { Link } from '@inertiajs/react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-app-pink-lighter flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Une erreur est survenue</h2>
                        <p className="text-gray-600 mb-4">
                            Désolé, une erreur inattendue s'est produite. Veuillez réessayer.
                        </p>
                        <div className="space-y-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Rafraîchir la page
                            </button>
                            <Link
                                href={route('dashboard')}
                                className="block w-full text-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Retour au tableau de bord
                            </Link>
                        </div>
                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                <p className="text-sm font-mono text-gray-800">
                                    {this.state.error?.toString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 