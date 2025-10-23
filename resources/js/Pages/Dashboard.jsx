import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Calendar, Users, BarChart3, Clock, MessageSquare, FileText, Bell, Star } from "lucide-react";

export default function Dashboard({ welcomeData, activityFeed }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'publication':
                return <FileText className="h-5 w-5 text-blue-500" />;
            case 'commentaire':
                return <MessageSquare className="h-5 w-5 text-green-500" />;
            case 'session':
                return <Calendar className="h-5 w-5 text-purple-500" />;
            case 'message_organisateur':
                return <Bell className="h-5 w-5 text-orange-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Accueil" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
                        <CardTitle className="text-3xl font-bold mb-4 text-gray-800">
                            Bienvenue {user?.name},
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600 mb-8">
                            {user?.role === 'organisateur' && (
                                <span>Voici vos événements à venir :</span>
                            )}
                            {user?.role === 'intervenant' && (
                                <span>{welcomeData.message}</span>
                            )}
                            {!user?.role && (
                                <span>Bienvenue sur votre espace personnel.</span>
                            )}
                        </CardDescription>

                        {/* Mur d'activité */}
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">Mur d'activité</h3>
                            <div className="space-y-4">
                                {activityFeed && activityFeed.length > 0 ? (
                                    activityFeed.map((activity) => (
                                        <div key={`${activity.type}-${activity.id}`} 
                                             className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex-shrink-0 mt-1">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-gray-500">
                                                        {formatDate(activity.created_at)}
                                                    </p>
                                                </div>
                                                <p className="mt-1 text-gray-800">
                                                    {activity.type === 'publication' && (
                                                        <span><strong>{activity.user_name}</strong> a publié dans "{activity.event_name}" : {activity.message}</span>
                                                    )}
                                                    {activity.type === 'commentaire' && (
                                                        <span><strong>{activity.user_name}</strong> a commenté dans "{activity.event_name}" : {activity.message}</span>
                                                    )}
                                                    {activity.type === 'session' && (
                                                        <span> {activity.message}</span>
                                                    )}
                                                    {activity.type === 'message_organisateur' && (
                                                        <span>{activity.message}</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
                                )}
                            </div>
                        </div>

                        {/* Section des événements à venir (pour les organisateurs) */}
                        {user?.role === 'organisateur' && welcomeData.upcomingEvents && welcomeData.upcomingEvents.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-4">Vos prochains événements :</h3>
                                <ul className="space-y-4">
                                    {welcomeData.upcomingEvents.map(event => (
                                        <li key={event.id_evenement} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-sm">
                                            <Calendar className="h-6 w-6 text-violet-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-lg font-medium text-gray-900">{event.nom}</p>
                                                <p className="text-sm text-gray-600">Le {formatDate(event.date_debut)}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
