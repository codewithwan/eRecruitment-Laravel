// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, RefreshCw, LogOut } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
            <Head title="Verifikasi Email" />
            
            <header className="py-4 px-6 shadow-sm bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="font-bold text-xl text-black ml-8">MITRA KARYA GROUP</div>
                </div>
            </header>
            
            <main className="flex-grow flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100/50">
                        <div className="flex justify-center mb-6">
                            <div className="bg-blue-100 rounded-full p-4 animate-pulse">
                                <Mail className="w-12 h-12 text-blue-500" />
                            </div>
                        </div>

                        <div className="text-center space-y-4 mb-8">
                            <h1 className="text-blue-500 text-3xl font-bold">Verifikasi Email Anda</h1>
                            <div className="space-y-2">
                                <p className="text-gray-600">
                                    Kami telah mengirim email verifikasi ke alamat email Anda.
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Periksa folder inbox atau spam Anda, lalu klik tautan verifikasi yang ada di email.
                                </p>
                            </div>
                        </div>

                        {status === 'verification-link-sent' && (
                            <div className="mb-6 text-center animate-fadeIn">
                                <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg flex items-center justify-center gap-2">
                                    <RefreshCw className="h-4 w-4" />
                                    <p className="text-sm font-medium">Link verifikasi baru telah dikirim ke email Anda</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <Button 
                                disabled={processing} 
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 h-12 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <LoaderCircle className="h-5 w-5 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-5 w-5" />
                                )}
                                Kirim Ulang Email Verifikasi
                            </Button>

                            <div className="text-center pt-4 border-t border-gray-100">
                                <TextLink 
                                    href={route('logout')} 
                                    method="post" 
                                    className="text-sm text-gray-500 hover:text-gray-700 font-medium no-underline inline-flex items-center gap-2 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Keluar
                                </TextLink>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
