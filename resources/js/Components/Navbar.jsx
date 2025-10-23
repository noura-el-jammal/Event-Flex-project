import { Link } from '@inertiajs/react';
import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar({ user }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <nav className="bg-[#C562AF] border-b border-[#C562AF]/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="shrink-0 flex items-center">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-white" />
                            </Link>
                        </div>

                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                Accueil
                            </NavLink>
                            <NavLink href={route('evenements.index')} active={route().current('evenements.index')}>
                                Événements
                            </NavLink>
                            {user?.role === 'organisateur' && (
                                <NavLink href={route('evenements.create')} active={route().current('evenements.create')}>
                                    Créer un événement
                                </NavLink>
                            )}
                        </div>
                    </div>

                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        <div className="ml-3 relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white hover:text-gray-200 focus:outline-none transition ease-in-out duration-150"
                                        >
                                            {user?.name}

                                            <svg
                                                className="ml-2 -mr-0.5 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 =0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profil</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Déconnexion
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-[#C562AF]/80 focus:outline-none focus:bg-[#C562AF]/80 active:bg-[#C562AF]/90 transition duration-150 ease-in-out"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                <div className="pt-2 pb-3 space-y-1">
                    <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                        Accueil
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route('evenements.index')} active={route().current('evenements.index')}>
                        Événements
                    </ResponsiveNavLink>
                    {user?.role === 'organisateur' && (
                        <ResponsiveNavLink href={route('evenements.create')} active={route().current('evenements.create')}>
                            Créer un événement
                        </ResponsiveNavLink>
                    )}
                </div>

                <div className="pt-4 pb-1 border-t border-[#C562AF]/20">
                    <div className="px-4">
                        <div className="font-medium text-base text-white">{user?.name}</div>
                        <div className="font-medium text-sm text-white/80">{user?.email}</div>
                    </div>

                    <div className="mt-3 space-y-1">
                        <ResponsiveNavLink href={route('profile.edit')}>Profil</ResponsiveNavLink>
                        <ResponsiveNavLink method="post" href={route('logout')} as="button">
                            Déconnexion
                        </ResponsiveNavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
} 