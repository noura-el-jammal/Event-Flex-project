import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

export default function StarRating({ evenementId, initialRating = 0, onRatingChange }) {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    const handleRating = (selectedRating) => {
        setRating(selectedRating);
        if (onRatingChange) {
            onRatingChange(selectedRating);
        }
        
        // Envoyer l'évaluation au serveur
        router.post(route('evaluations.store', evenementId), {
            note: selectedRating
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // L'évaluation a été enregistrée avec succès
            }
        });
    };

    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="focus:outline-none"
                >
                    {star <= (hover || rating) ? (
                        <StarIcon className="h-6 w-6 text-yellow-400" />
                    ) : (
                        <StarOutlineIcon className="h-6 w-6 text-yellow-400" />
                    )}
                </button>
            ))}
        </div>
    );
} 