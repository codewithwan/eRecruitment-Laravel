import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, CheckCircle2, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

interface ResetPasswordProps {
    token: string;
    email: string;
    status?: string;
}

export default function ResetPassword({ token, email, status }: ResetPasswordProps) {
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const confirmValue = e.target.value;
        setData('password_confirmation', confirmValue);
        setPasswordMatch(confirmValue === '' || confirmValue === data.password);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Head title="Atur Ulang Kata Sandi" />

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
                                <ShieldCheck className="h-8 w-8 text-blue-600" />
                            </div>
                            <h1 className="text-blue-600 text-2xl font-bold mb-2">Buat Kata Sandi Baru</h1>
                            <p className="text-gray-500 text-sm">Silakan masukkan kata sandi baru untuk akun Anda</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password" className="font-medium text-gray-700">
                                        Kata Sandi Baru
                                    </Label>
                                    <span className="text-xs text-gray-500">Wajib diisi</span>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        //type={showPassword ? "text" : "password"}
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Masukkan kata sandi baru"
                                        className="w-full bg-gray-50 focus:bg-white transition-colors pr-10 text-black"
                                    />
                                    <button 
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                                <div className="flex items-center gap-1.5 mt-1">
                                    <AlertCircle className={`h-3 w-3 ${data.password.length >= 8 ? 'text-green-500' : 'text-amber-500'}`} />
                                    <p className={`text-xs ${data.password.length >= 8 ? 'text-green-600' : 'text-amber-600'}`}>
                                        Kata sandi minimal 8 karakter
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password_confirmation" className="font-medium text-gray-700">
                                        Konfirmasi Kata Sandi
                                    </Label>
                                    <span className="text-xs text-gray-500">Wajib diisi</span>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        //type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={data.password_confirmation}
                                        onChange={handleConfirmPassword}
                                        placeholder="Masukkan ulang kata sandi"
                                        className={`w-full bg-gray-50 focus:bg-white transition-colors pr-10 text-black ${!passwordMatch && data.password_confirmation ? 'border-red-300 focus:border-red-500' : ''}`}
                                    />
                                    <button 
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} />
                                {data.password_confirmation && !passwordMatch && (
                                    <p className="text-red-500 text-xs flex items-center mt-1">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        <span>Kata sandi tidak cocok</span>
                                    </p>
                                )}
                                {data.password_confirmation && passwordMatch && data.password_confirmation.length > 0 && (
                                    <p className="text-green-600 text-xs flex items-center mt-1">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        <span>Kata sandi cocok</span>
                                    </p>
                                )}
                            </div>

                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 h-11 font-medium rounded-md"
                                    disabled={processing || !data.password || !data.password_confirmation || !passwordMatch}
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                            Memproses...
                                        </>
                                    ) : (
                                        "Perbarui Kata Sandi"
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

