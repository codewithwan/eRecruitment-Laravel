import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Head title="Masuk" />

            <header className="py-4 px-6 shadow">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="font-bold text-xl text-blue-600">MITRA KARYA GROUP</div>
                    <div className="flex items-center gap-x-4">
                        <Link
                            href={route('register')}
                            className="px-4 py-2 border-blue-500 text-blue-500 font-normal hover:bg-blue-50 transition"
                        >
                            Daftar
                        </Link>
                        <a
                            href="#"
                            className="px-4 py-2 rounded-md bg-blue-500 text-white font-normal hover:bg-blue-600 transition"
                        >
                            Masuk
                        </a>
                    </div>
                </div>
            </header>
            
            <main className="flex-grow flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-6">
                        <h1 className="text-blue-500 text-4xl font-bold mb-3 whitespace-nowrap text-justify">Selamat Datang Kembali!</h1>
                        <p className="text-gray-600 text-sm">
                            Sudah siap melangkah lebih dekat ke peluang impian Anda? Masuk sekarang dan lanjutkan perjalanan karier Anda bersama kami!
                        </p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-base font-medium text-black">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Masukkan email Anda"
                                    className="w-full bg-gray-100 text-black"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-base font-mediumm text-black">Kata Sandi</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Masukkan kata sandi Anda"
                                    className="w-full bg-gray-100 text-black"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 h-10"
                                tabIndex={3}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Masuk
                            </Button>

                            <div className="flex justify-end">
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="text-sm text-blue-500 hover:text-blue-700 font-medium no-underline" tabIndex={4}>
                                        Lupa Kata Sandi?
                                    </TextLink>
                                )}
                            </div>
                        </div>

                        <div className="text-center text-sm mt-4">
                            <p className="text-gray-600 font-medium">
                                Anda belum mempunyai akun?{' '}
                                <TextLink href={route('register')} className="text-blue-500 hover:text-blue-700 font-medium no-underline" tabIndex={5}>
                                    Daftar
                                </TextLink>
                            </p>
                        </div>
                    </form>

                    {status && (
                        <div className="mt-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}