import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import LeafletMap from './LeafletMap';

export default function Edit({ auth, evenement }) {
    const { data, setData, put, processing, errors } = useForm({
        titre: evenement.titre,
        date_debut: evenement.date_debut,
        lieu: evenement.lieu,
        duree: evenement.duree,
        latitude: evenement.latitude,
        longitude: evenement.longitude,
        address: evenement.lieu,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('evenements.update', evenement.id_evenement));
    };

    const handleLocationSelect = ({ lat, lng, address }) => {
        setData('latitude', lat);
        setData('longitude', lng);
        setData('address', address);
        setData('lieu', address);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="max-w-2xl mx-auto p-4">
                <h1 className="text-xl font-bold mb-4">Modifier l'événement</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-1">Titre</label>
                        <input 
                            type="text" 
                            value={data.titre} 
                            onChange={e => setData('titre', e.target.value)} 
                            className="w-full p-2 border rounded" 
                        />
                        {errors.titre && <div className="text-red-500">{errors.titre}</div>}
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Date de début</label>
                        <input 
                            type="datetime-local" 
                            value={data.date_debut} 
                            onChange={e => setData('date_debut', e.target.value)} 
                            className="w-full p-2 border rounded" 
                        />
                        {errors.date_debut && <div className="text-red-500">{errors.date_debut}</div>}
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Lieu</label>
                        <input 
                            type="text" 
                            value={data.address}
                            readOnly
                            className={`w-full p-2 border rounded bg-gray-100 cursor-not-allowed ${errors.lieu ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.lieu && <div className="text-red-500">{errors.lieu}</div>}
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Lieu sur carte</label>
                        <LeafletMap onLocationSelect={handleLocationSelect} />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Durée (en minutes)</label>
                        <input 
                            type="number" 
                            value={data.duree} 
                            onChange={e => setData('duree', e.target.value)} 
                            className="w-full p-2 border rounded" 
                            min="1"
                        />
                        {errors.duree && <div className="text-red-500">{errors.duree}</div>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing} 
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? 'Mise à jour...' : 'Mettre à jour'}
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
