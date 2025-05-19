import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, CheckCircle2, Mail } from 'lucide-react';
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
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Head title="Lupa Kata Sandi" />

            <header className="py-4 px-6 bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto flex justify-start items-center">
                    <div className="font-bold text-xl text-black">MITRA KARYA GROUP</div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
                        {status && (
                            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 flex items-center">
                                <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                                <span>{status}</span>
                            </div>
                        )}

                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <Mail className="h-8 w-8 text-blue-600" />
                            </div>
                            <h1 className="text-blue-600 text-2xl font-bold mb-2">Lupa Kata Sandi?</h1>
                            <p className="text-gray-500 text-sm">
                                Masukkan email Anda untuk mereset ulang kata sandi
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="email" className="font-medium text-gray-700">Email</Label>
                                    <span className="text-xs text-gray-500">Wajib diisi</span>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Masukkan email Anda"
                                        className="w-full bg-gray-50 focus:bg-white transition-colors"
                                    />
                                </div>
                                <InputError message={errors.email} />
                                <p className="text-xs text-gray-500 mt-1">
                                    Permintaan pengaturan ulang kata sandi akan dikirim ke alamat email yang Anda masukkan di atas.
                                </p>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 h-11 font-medium rounded-md"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                            Memproses...
                                        </>
                                    ) : (
                                        "Reset Kata Sandi"
                                    )}
                                </Button>
                            </div>

                            <div className="mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full !bg-white !text-black !border-gray-300 hover:!bg-gray-100 hover:!text-black"
                                    onClick={() => window.location.href = route('login')}
                                >
                                    ← Kembali ke Login
                                </Button>
                            </div>

                            <div className="text-center text-sm pt-2">
                                <p className="text-gray-600 font-medium">
                                    Anda belum mempunyai akun?{' '}
                                    <TextLink href={route('register')} className="text-blue-500 hover:text-blue-700 font-medium no-underline">
                                        Daftar
                                    </TextLink>
                                </p>
                            </div>
                        </form>
                    </div>
                    
                    <p className="mt-6 text-center text-xs text-gray-500">
                        © {new Date().getFullYear()} Mitra Karya Group. All rights reserved.
                    </p>
                </div>
            </main>
        </div>
    );
}
