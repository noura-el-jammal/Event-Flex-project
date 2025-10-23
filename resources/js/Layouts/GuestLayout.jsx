import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-app-violet-lighter via-white to-app-violet-light">
            <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
                <Link href="/">
                    <ApplicationLogo className="w-24 h-24 fill-current text-app-violet-medium drop-shadow-lg" />
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-8 py-6 bg-white shadow-xl overflow-hidden sm:rounded-2xl border border-app-violet-light/20 backdrop-blur-sm">
                {children}
            </div>
        </div>
    );
}
