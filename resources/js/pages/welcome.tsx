import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface WelcomeProps {
    vacancies: JobOpening[];
}

interface JobOpening {
    title: string;
    department: string;
    location: string;
    requirements: string[];
    benefits?: string[];
}

const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function Welcome(props: WelcomeProps) {
    const { vacancies } = props;
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=outfit:300,400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-white text-gray-900">
                {/* Header/Navigation */}
                <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-600 shadow-md">
                                    <span className="text-lg font-bold text-white">MKA</span>
                                </div>
                                <span className="text-lg font-semibold">PT MITRA KARYA ANALITIKA</span>
                            </div>
                            <nav className="hidden items-center space-x-8 md:flex">
                                <a
                                    href="#about"
                                    onClick={() => scrollToSection('about')}
                                    className="font-medium text-gray-600 transition-colors hover:text-blue-600"
                                >
                                    Tentang
                                </a>
                                <a
                                    href="#jobs"
                                    onClick={() => scrollToSection('jobs')}
                                    className="font-medium text-gray-600 transition-colors hover:text-blue-600"
                                >
                                    Karir
                                </a>
                                <a
                                    href="#contact"
                                    onClick={() => scrollToSection('contact')}
                                    className="font-medium text-gray-600 transition-colors hover:text-blue-600"
                                >
                                    Kontak
                                </a>
                            </nav>
                            <div className="flex items-center space-x-4">
                                {auth?.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-lg border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-50 to-white py-20">
                    <div className="container mx-auto px-6">
                        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                            <div className="mb-6 inline-block rounded-xl bg-blue-100 p-2">
                                <span className="px-3 text-sm font-medium text-blue-600">Kami Sedang Merekrut</span>
                            </div>
                            <h1 className="mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl lg:text-6xl">
                                Temukan Karir Impian Anda di Mitra Karya Analitika
                            </h1>
                            <p className="mb-8 max-w-2xl text-lg text-gray-600">
                                Bergabunglah dengan tim profesional berbasis data kami dan bantu membentuk masa depan analitik di Indonesia.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Button className="rounded-xl bg-blue-600 px-6 py-6 text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200">
                                    Lihat Posisi Terbuka
                                </Button>
                                <Button className="rounded-xl border border-blue-300 bg-transparent px-6 py-6 text-blue-600 text-white hover:bg-blue-100">
                                    Hubungi Kami
                                </Button>
                            </div>

                            <div className="mt-16 grid w-full max-w-xl grid-cols-3 gap-4">
                                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-md">
                                    <div className="font-semibold text-blue-600">15+</div>
                                    <div className="text-sm text-gray-500">Tahun Pengalaman</div>
                                </div>
                                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-md">
                                    <div className="font-semibold text-blue-600">200+</div>
                                    <div className="text-sm text-gray-500">Profesional</div>
                                </div>
                                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-md">
                                    <div className="font-semibold text-blue-600">50+</div>
                                    <div className="text-sm text-gray-500">Klien Utama</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="mb-12 text-center">
                            <div className="mb-6 inline-block rounded-xl bg-blue-100 p-2">
                                <span className="px-3 text-sm font-medium text-blue-600">Tentang Kami</span>
                            </div>
                            <h2 className="mb-4 text-3xl font-bold">Mengapa Bergabung dengan PT MITRA KARYA ANALITIKA</h2>
                            <p className="mx-auto max-w-2xl text-gray-600">
                                Kami menawarkan tempat kerja yang dinamis di mana Anda dapat berkembang secara profesional sambil memberikan dampak
                                nyata.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-blue-100 hover:shadow-md">
                                <div className="mb-4 inline-block rounded-lg bg-blue-50 p-3 text-blue-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                    </svg>
                                </div>
                                <h3 className="mb-3 text-xl font-medium">Pemimpin Industri</h3>
                                <p className="text-gray-600">
                                    Perusahaan analitik data terkemuka yang menyediakan solusi inovatif di seluruh Indonesia.
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-blue-100 hover:shadow-md">
                                <div className="mb-4 inline-block rounded-lg bg-blue-50 p-3 text-blue-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 22h14"></path>
                                        <path d="M5 2h14"></path>
                                        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path>
                                        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path>
                                    </svg>
                                </div>
                                <h3 className="mb-3 text-xl font-medium">Pertumbuhan Karir</h3>
                                <p className="text-gray-600">Jalur yang jelas untuk kemajuan dan peluang pengembangan profesional.</p>
                            </div>

                            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-blue-100 hover:shadow-md">
                                <div className="mb-4 inline-block rounded-lg bg-blue-50 p-3 text-blue-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                                <h3 className="mb-3 text-xl font-medium">Tim Kolaboratif</h3>
                                <p className="text-gray-600">Bekerja dengan profesional berbakat dalam lingkungan yang mendukung dan inovatif.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Open Positions Section */}
                <section id="jobs" className="bg-gradient-to-br from-white to-blue-50 py-20">
                    <div className="container mx-auto px-6">
                        <div className="mb-12 text-center">
                            <div className="mb-6 inline-block rounded-xl bg-blue-100 p-2">
                                <span className="px-3 text-sm font-medium text-blue-600">Karir</span>
                            </div>
                            <h2 className="mb-4 text-3xl font-bold">Posisi Terbuka</h2>
                            <p className="mx-auto max-w-2xl text-gray-600">
                                Bergabunglah dengan tim kami dan menjadi bagian dari sesuatu yang istimewa.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {vacancies.map((job, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                                >
                                    <div>
                                        <h3 className="mb-2 text-xl font-semibold text-blue-900">{job.title}</h3>
                                        <div className="mb-6 flex items-center space-x-2 text-gray-500">
                                            <span className="inline-block rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-600">
                                                {job.department}
                                            </span>
                                            <span>•</span>
                                            <span className="text-sm">{job.location}</span>
                                        </div>
                                        <ul className="mb-4 list-inside list-disc text-gray-600">
                                            {Array.isArray(job.requirements)
                                                ? job.requirements.map((requirement, reqIndex) => <li key={reqIndex}>{requirement}</li>)
                                                : job.requirements && <li>{job.requirements}</li>}
                                            {job.benefits && Array.isArray(job.benefits) && job.benefits.length > 0 && (
                                                <li className="">Benefit: {job.benefits.join(', ')}</li>
                                            )}
                                        </ul>
                                    </div>
                                    <Button className="mt-4 w-full rounded-xl bg-blue-600 px-6 py-3 text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200">
                                        Lihat detail
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* <div className="mt-12 text-center">
                            <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-6 rounded-xl shadow-md text-white">Lihat Semua Posisi</Button>
                        </div> */}
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="mx-auto max-w-3xl rounded-2xl bg-blue-600 p-10 text-center shadow-xl shadow-blue-200">
                            <h2 className="mb-4 text-3xl font-bold text-white">Siap Bergabung dengan Tim Kami?</h2>
                            <p className="mx-auto mb-8 max-w-lg text-blue-100">
                                Ambil langkah pertama menuju karir yang memuaskan di PT MITRA KARYA ANALITIKA.
                            </p>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Button className="rounded-xl bg-white px-6 py-6 text-blue-600 hover:bg-blue-50">Lamar Sekarang</Button>
                                <Button className="rounded-xl border border-blue-300 bg-transparent px-6 py-6 text-white hover:bg-blue-700">
                                    Hubungi Kami
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-100 bg-gray-50 py-10">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col items-center justify-between md:flex-row">
                            <div className="mb-6 flex items-center space-x-2 md:mb-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
                                    <span className="font-bold text-white">MKA</span>
                                </div>
                                <span className="font-semibold">PT MITRA KARYA ANALITIKA</span>
                            </div>
                            <div className="mb-6 flex gap-8 md:mb-0">
                                <a href="#about" className="text-sm text-gray-600 transition-colors hover:text-blue-600">
                                    Tentang
                                </a>
                                <a href="#jobs" className="text-sm text-gray-600 transition-colors hover:text-blue-600">
                                    Karir
                                </a>
                                <a href="#contact" className="text-sm text-gray-600 transition-colors hover:text-blue-600">
                                    Kontak
                                </a>
                            </div>
                            <div className="flex space-x-6">
                                <a href="#" className="text-blue-500 transition-colors hover:text-blue-700">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                        <rect x="2" y="9" width="4" height="12"></rect>
                                        <circle cx="4" cy="4" r="2"></circle>
                                    </svg>
                                </a>
                                <a href="#" className="text-blue-500 transition-colors hover:text-blue-700">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-blue-500 transition-colors hover:text-blue-700">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                            <span className="text-sm text-gray-500">
                                © {new Date().getFullYear()} PT MITRA KARYA ANALITIKA. Semua hak dilindungi.
                            </span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
