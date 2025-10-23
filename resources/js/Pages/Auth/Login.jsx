import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { csrf_token } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        _token: csrf_token,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
            headers: {
                'X-CSRF-TOKEN': csrf_token,
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
    };

    return (
        <GuestLayout>
            
            <Head title="Connexion" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-gray-700 font-medium" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-gray-300 focus:border-app-violet-medium focus:ring focus:ring-app-violet-light focus:ring-opacity-50 rounded-lg shadow-sm"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
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
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-gray-300 text-app-violet-medium focus:ring-app-violet-light"
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Se souvenir de moi
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-app-violet-medium hover:text-app-violet-dark transition-colors duration-200"
                        >
                            Mot de passe oublié ?
                        </Link>
                    )}
                </div>

                <div className="flex flex-col space-y-4">
                    <PrimaryButton 
                        className="w-full justify-center bg-app-violet-medium hover:bg-app-violet-dark text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
                        disabled={processing}
                    >
                        Se connecter
                    </PrimaryButton>

                    <p className="text-center text-sm text-gray-600">
                        Pas encore de compte ?{' '}
                        <Link
                            href={route('register')}
                            className="text-app-violet-medium hover:text-app-violet-dark font-medium transition-colors duration-200"
                        >
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
