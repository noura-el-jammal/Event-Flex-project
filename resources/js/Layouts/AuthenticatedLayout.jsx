import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import EventSearchBar from '@/Components/EventSearchBar';
import { HeartIcon, ChatBubbleLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash, csrf_token } = usePage().props;
    const user = auth?.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const handleSearch = (searchParams) => {
        console.log('Search params in Layout:', searchParams);
        router.get(
            route('evenements.index'),
            searchParams,
            {
                preserveState: true,
                preserveScroll: true,
                only: ['evenements', 'filters']
            }
        );
    };

    return (
        <div className="min-h-screen bg-app-pink-lighter">
            <meta name="csrf-token" content={csrf_token} />
            <nav className="border-b border-app-pink-medium bg-[#C562AF]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <img src="/images/event-flex-logo.png" alt="EventFlex Logo" className="block h-9 w-auto" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="text-white hover:text-app-pink-lighter focus:text-app-pink-lighter active:text-app-pink-lighter border-transparent hover:border-app-pink-light focus:border-app-pink-light"
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href={route('evenements.index')}
                                    active={route().current('evenements.index')}
                                    className="text-white hover:text-app-pink-lighter focus:text-app-pink-lighter active:text-app-pink-lighter border-transparent hover:border-app-pink-light focus:border-app-pink-light"
                                >
                                    Événements
                                </NavLink>
                                {user.role === 'organisateur' && (
                                    <NavLink
                                        href={route('evenements.create')}
                                        active={route().current('evenements.create')}
                                        className="text-white hover:text-app-pink-lighter focus:text-app-pink-lighter active:text-app-pink-lighter border-transparent hover:border-app-pink-light focus:border-app-pink-light"
                                    >
                                        Créer un événement
                                    </NavLink>
                                )}
                                <NavLink
                                    href={route('favoris.index')}
                                    active={route().current('favoris.index')}
                                    className="text-white hover:text-app-pink-lighter focus:text-app-pink-lighter active:text-app-pink-lighter border-transparent hover:border-app-pink-light focus:border-app-pink-light"
                                >
                                    <div className="flex items-center space-x-1">
                                        <HeartIcon className="h-5 w-5" />
                                        <span>Favoris</span>
                                    </div>
                                </NavLink>
                                <NavLink
                                    href={route('publications.index', { id_evenement: 'all' })}
                                    active={route().current('publications.index')}
                                    className="text-white hover:text-app-pink-lighter focus:text-app-pink-lighter active:text-app-pink-lighter border-transparent hover:border-app-pink-light focus:border-app-pink-light"
                                >
                                    <div className="flex items-center space-x-1">
                                        <ChatBubbleLeftIcon className="h-5 w-5" />
                                        <span>Publications</span>
                                    </div>
                                </NavLink>
                                <NavLink
                                    href={route('messages.index')}
                                    active={route().current('messages.index')}
                                    className="text-white hover:text-app-pink-lighter focus:text-app-pink-lighter active:text-app-pink-lighter border-transparent hover:border-app-pink-light focus:border-app-pink-light"
                                >
                                    <div className="flex items-center space-x-1">
                                        <EnvelopeIcon className="h-5 w-5" />
                                        <span>Messages</span>
                                    </div>
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white hover:bg-app-pink-medium focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user?.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-app-pink-medium hover:text-white focus:bg-app-pink-medium focus:text-white focus:outline-none transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            className="text-white hover:bg-app-pink-medium hover:text-white focus:bg-app-pink-medium focus:text-white"
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('evenements.index')}
                            active={route().current('evenements.index')}
                            className="text-white hover:bg-app-pink-medium hover:text-white focus:bg-app-pink-medium focus:text-white"
                        >
                            Événements
                        </ResponsiveNavLink>
                        {user.role === 'organisateur' && (
                            <ResponsiveNavLink
                                href={route('evenements.create')}
                                active={route().current('evenements.create')}
                                className="text-white hover:bg-app-pink-medium hover:text-white focus:bg-app-pink-medium focus:text-white"
                            >
                                Créer un événement
                            </ResponsiveNavLink>
                        )}
                        <ResponsiveNavLink
                            href={route('favoris.index')}
                            active={route().current('favoris.index')}
                            className="text-white hover:bg-app-pink-medium hover:text-white focus:bg-app-pink-medium focus:text-white"
                        >
                            <div className="flex items-center space-x-1">
                                <HeartIcon className="h-5 w-5" />
                                <span>Favoris</span>
                            </div>
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('publications.index', { id_evenement: 'all' })}
                            active={route().current('publications.index')}
                            className="text-white hover:bg-app-pink-medium hover:text-white focus:bg-app-pink-medium focus:text-white"
                        >
                            <div className="flex items-center space-x-1">
                                <ChatBubbleLeftIcon className="h-5 w-5" />
                                <span>Publications</span>
                            </div>
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('messages.index')}
                            active={route().current('messages.index')}
                            className="text-white hover:bg-app-pink-medium hover:text-white focus:bg-app-pink-medium focus:text-white"
                        >
                            <div className="flex items-center space-x-1">
                                <EnvelopeIcon className="h-5 w-5" />
                                <span>Messages</span>
                            </div>
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-10 w-10 fill-current text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>

                            <div className="ms-3">
                                <div className="text-base font-medium text-gray-800">
                                    {user?.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {user?.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {route().current('evenements.*') && (
                <EventSearchBar onSearch={handleSearch} />
            )}

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Flash Messages */}
            {flash?.success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative max-w-7xl mx-auto mt-4" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> {flash.success}</span>
                </div>
            )}
            {flash?.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-7xl mx-auto mt-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {flash.error}</span>
                </div>
            )}

            <main>{children}</main>
        </div>
    );
}
