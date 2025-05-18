import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, CheckCircle2 } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Label } from '@/components/ui/label';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Head title="Lupa Kata Sandi" />

            <header className="py-4 px-6 shadow">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="font-bold text-xl text-blue-600">MITRA KARYA GROUP</div>
                </div>
            </header>

            <main className="flex-grow flex justify-center py-30 px-4">
                <div className="w-full max-w-md">
                    {status && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            <span>{status}</span>
                        </div>
                    )}

                    <div className="text-center mb-6">
                        <h1 className="text-blue-500 text-4xl font-bold mb-4">Lupa Kata Sandi?</h1>
                        <p className="text-gray-600 text-sm mt-2">
                            Masukkan email Anda untuk mereset ulang kata sandi
                        </p>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-base font-medium text-black">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Masukkan email Anda"
                                className="w-full bg-gray-100 text-black"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Permintaan pengaturan ulang kata sandi akan dikirim ke alamat email yang Anda masukkan di atas.
                            </p>
                            <InputError message={errors.email} />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 h-10"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Reset Kata Sandi
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full !bg-white !text-black !border-gray-300 hover:!bg-gray-100 hover:!text-black"
                            onClick={() => window.location.href = route('login')}
                        >
                            ← Kembali ke Login
                        </Button>

                        <div className="text-center text-sm">
                            <p className="text-gray-600 font-medium">
                                Anda belum mempunyai akun?{' '}
                                <TextLink href={route('register')} className="text-blue-500 hover:text-blue-700 font-medium no-underline">
                                    Daftar
                                </TextLink>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
