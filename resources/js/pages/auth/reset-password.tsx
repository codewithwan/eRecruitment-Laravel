import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, CheckCircle2 } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

interface ResetPasswordProps {
    token: string; // Token tetap dibutuhkan untuk keamanan saat reset password
    status?: string;
}

export default function ResetPassword({ token, status }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.update'));
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Head title="Atur Ulang Kata Sandi" />

            <header className="py-4 px-6 shadow">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="font-bold text-xl text-black">MITRA KARYA GROUP</div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    {status && (
                        <div className="bg-green-500 text-white px-4 py-3 rounded mb-4 flex items-center">
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            <span>{status}</span>
                        </div>
                    )}

                    <div className="text-center mb-6">
                        <h1 className="text-blue-500 text-3xl font-bold mb-2">Masukkan Kata Sandi Baru</h1>
                        <p className="text-sm text-gray-500">Atur ulang kata sandi Anda.</p>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="password">Kata sandi baru</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Masukkan kata sandi baru"
                                className="w-full bg-gray-100"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Konfirmasi Kata sandi</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Masukkan ulang kata sandi"
                                className="w-full bg-gray-100"
                            />
                            <InputError message={errors.password_confirmation} />
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
                            className="w-full"
                            onClick={() => window.location.href = route('login')}
                        >
                            ← Kembali ke Login
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}

