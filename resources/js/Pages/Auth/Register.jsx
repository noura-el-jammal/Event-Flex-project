import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'participants',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Inscription" />

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nom" className="text-gray-700 font-medium" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full border-gray-300 focus:border-app-violet-medium focus:ring focus:ring-app-violet-light focus:ring-opacity-50 rounded-lg shadow-sm"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-gray-700 font-medium" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-gray-300 focus:border-app-violet-medium focus:ring focus:ring-app-violet-light focus:ring-opacity-50 rounded-lg shadow-sm"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Mot de passe" className="text-gray-700 font-medium" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-gray-300 focus:border-app-violet-medium focus:ring focus:ring-app-violet-light focus:ring-opacity-50 rounded-lg shadow-sm"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" className="text-gray-700 font-medium" />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full border-gray-300 focus:border-app-violet-medium focus:ring focus:ring-app-violet-light focus:ring-opacity-50 rounded-lg shadow-sm"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="role" value="Type de compte" className="text-gray-700 font-medium" />

                    <select
                        id="role"
                        name="role"
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        className="mt-1 block w-full border-gray-300 focus:border-app-violet-medium focus:ring focus:ring-app-violet-light focus:ring-opacity-50 rounded-lg shadow-sm"
                    >
                        <option value="participants">Participant</option>
                        <option value="organisateur">Organisateur</option>
                    </select>

                    <InputError message={errors.role} className="mt-2" />
                </div>

                <div className="flex flex-col space-y-4">
                    <PrimaryButton 
                        className="w-full justify-center bg-app-violet-medium hover:bg-app-violet-dark text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
                        disabled={processing}
                    >
                        S'inscrire
                    </PrimaryButton>

                    <p className="text-center text-sm text-gray-600">
                        Déjà inscrit ?{' '}
                        <Link
                            href={route('login')}
                            className="text-app-violet-medium hover:text-app-violet-dark font-medium transition-colors duration-200"
                        >
                            Se connecter
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
