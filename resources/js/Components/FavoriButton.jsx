import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'react-hot-toast';

export default function FavoriButton({ evenementId, initialIsFavori = false }) {
    const [isFavori, setIsFavori] = useState(initialIsFavori);
    const [isLoading, setIsLoading] = useState(false);
    const { flash } = usePage().props;

    useEffect(() => {
        setIsFavori(initialIsFavori);
    }, [initialIsFavori]);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const toggleFavori = () => {
        setIsLoading(true);
        if (isFavori) {
            router.delete(route('favoris.destroy', evenementId), {
                onSuccess: () => {
                    setIsFavori(false);
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                }
            });
        } else {
            router.post(route('favoris.store'), {
                id_evenement: evenementId
            }, {
                onSuccess: () => {
                    setIsFavori(true);
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                }
            });
        }
    };

    if (isLoading) {
        return (
            <button
                disabled
                className="p-2 text-gray-400 cursor-not-allowed"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
        );
    }

    return (
        <button
            onClick={toggleFavori}
            className={`p-2 transition-colors duration-200 ${
                isFavori ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
            }`}
        >
            <svg className="w-6 h-6" fill={isFavori ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>
    );
} 