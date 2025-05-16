import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Label } from '@/components/ui/label';

type RegisterForm = {
    ektp: string;
    nama: string;
    email: string;
    password: string;
};

interface RegisterProps {
    status?: string;
}

export default function Register({ status }: RegisterProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        ektp: '',
        nama: '',
        email: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Head title="Daftar" />
            
            <header className="py-4 px-6 shadow">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="font-bold text-xl text-blue-600 ml-8">MITRA KARYA GROUP</div>
                    <div className="flex items-center gap-x-4">
                        <Link
                            href={route('login')}
                            className="px-4 py-2 border-blue-500 text-blue-500 font-normal hover:bg-blue-50 transition"
                        >
                            Masuk
                        </Link>
                        <a
                            href="#"
                            className="px-4 py-2 rounded-md bg-blue-500 text-white font-normal hover:bg-blue-600 transition"
                        >
                            Daftar
                        </a>
                    </div>
                </div>
            </header>
            
            <main className="flex-grow py-12 px-4">
                <div className="grid grid-cols-1 place-items-center">
                    <div className="w-full max-w-3xl text-center mb-6">
                        <h1 className="text-blue-500 text-4xl font-bold mb-3 whitespace-nowrap">
                            Mulai Karier Impian Anda Hari Ini!
                        </h1>
                        <div className="max-w-xl mx-auto">
                        <p className="text-gray-600 text-sm">
                            Bergabunglah dengan ribuan profesional yang telah menemukan pekerjaan impian mereka.
                            Daftar sekarang dan temukan kesempatan terbaik untuk masa depan Anda!
                        </p>
                        </div>
                    </div>
                    
                    <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={submit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="ektp" className="text-base font-medium text-black">No E-KTP</Label>
                                <Input
                                    id="ektp"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    value={data.ektp}
                                    onChange={(e) => setData('ektp', e.target.value)}
                                    placeholder="Masukkan No E-KTP Anda"
                                    className="w-full bg-gray-100 text-black"
                                />
                                <InputError message={errors.ektp} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nama" className="text-base font-medium text-black">Nama Lengkap</Label>
                                <Input
                                    id="nama"
                                    type="text"
                                    required
                                    tabIndex={2}
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    placeholder="Masukkan nama lengkap Anda"
                                    className="w-full bg-gray-100 text-black"
                                />
                                <InputError message={errors.nama} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-base font-medium text-black">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={3}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Masukkan alamat email Anda"
                                    className="w-full bg-gray-100 text-black"
                                />
                                <InputError message={errors.email} />
                                <p className="text-xs text-gray-500">
                                    Anda akan menerima pemberituan pengumuman di alamat email yang didaftarkan.
                                    Pastikan menggunakan alamat email pribadi yang aktif.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-base font-medium text-black">Kata Sandi</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Buat kata sandi Anda"
                                    className="w-full bg-gray-100 text-black"
                                />
                                <InputError message={errors.password} />
                                <p className="text-xs text-gray-500">
                                    Kata sandi minimal terdiri 8 karakter, satu huruf kecil, satu huruf besar, satu angka 
                                    dan satu spesial karakter.
                                </p>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 h-10 mt-4" 
                                tabIndex={5} 
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Daftar 
                            </Button>
                        </div>

                        <div className="text-center text-sm mt-4 font-medium">
                            <p className="text-gray-600">
                                Sudah mempunyai akun? <TextLink href={route('login')} className="text-blue-500 hover:text-blue-700 no-underline" tabIndex={6}>
                                    Masuk
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