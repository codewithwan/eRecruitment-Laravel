import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";

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

// Add smooth scrolling behavior
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
                <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="bg-blue-600 w-10 h-10 rounded-md flex items-center justify-center shadow-md">
                                    <span className="text-white font-bold text-lg">MKA</span>
                                </div>
                                <span className="font-semibold text-lg">PT MITRA KARYA ANALITIKA</span>
                            </div>
                            <nav className="hidden md:flex items-center space-x-8">
                                <a href="#about" onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Tentang</a>
                                <a href="#jobs" onClick={() => scrollToSection('jobs')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Karir</a>
                                <a href="#contact" onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Kontak</a>
                            </nav>
                            <div className="flex items-center space-x-4">
                                {auth?.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-4 py-2 border border-blue-500 rounded-lg text-blue-600 font-medium text-sm hover:bg-blue-50 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:shadow-blue-200"
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
                <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                            <div className="inline-block mb-6 p-2 bg-blue-100 rounded-xl">
                                <span className="text-blue-600 font-medium text-sm px-3">Kami Sedang Merekrut</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Temukan Karir Impian Anda di Mitra Karya Analitika</h1>
                            <p className="text-gray-600 text-lg mb-8 max-w-2xl">Bergabunglah dengan tim profesional berbasis data kami dan bantu membentuk masa depan analitik di Indonesia.</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-6 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-200 transition-all text-white">
                                    Lihat Posisi Terbuka
                                </Button>
                                <Button className="border border-blue-300 text-white hover:bg-blue-100 px-6 py-6 rounded-xl bg-transparent text-blue-600">Hubungi Kami</Button>
                            </div>

                            <div className="mt-16 grid grid-cols-3 gap-4 w-full max-w-xl">
                                <div className="rounded-lg bg-white p-4 shadow-md border border-gray-100">
                                    <div className="font-semibold text-blue-600">15+</div>
                                    <div className="text-sm text-gray-500">Tahun Pengalaman</div>
                                </div>
                                <div className="rounded-lg bg-white p-4 shadow-md border border-gray-100">
                                    <div className="font-semibold text-blue-600">200+</div>
                                    <div className="text-sm text-gray-500">Profesional</div>
                                </div>
                                <div className="rounded-lg bg-white p-4 shadow-md border border-gray-100">
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
                        <div className="text-center mb-12">
                            <div className="inline-block mb-6 p-2 bg-blue-100 rounded-xl">
                                <span className="text-blue-600 font-medium text-sm px-3">Tentang Kami</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Mengapa Bergabung dengan PT MITRA KARYA ANALITIKA</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">Kami menawarkan tempat kerja yang dinamis di mana Anda dapat berkembang secara profesional sambil memberikan dampak nyata.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all">
                                <div className="text-blue-600 mb-4 bg-blue-50 p-3 inline-block rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium mb-3">Pemimpin Industri</h3>
                                <p className="text-gray-600">Perusahaan analitik data terkemuka yang menyediakan solusi inovatif di seluruh Indonesia.</p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all">
                                <div className="text-blue-600 mb-4 bg-blue-50 p-3 inline-block rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 22h14"></path>
                                        <path d="M5 2h14"></path>
                                        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path>
                                        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium mb-3">Pertumbuhan Karir</h3>
                                <p className="text-gray-600">Jalur yang jelas untuk kemajuan dan peluang pengembangan profesional.</p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all">
                                <div className="text-blue-600 mb-4 bg-blue-50 p-3 inline-block rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium mb-3">Tim Kolaboratif</h3>
                                <p className="text-gray-600">Bekerja dengan profesional berbakat dalam lingkungan yang mendukung dan inovatif.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Open Positions Section */}
                <section id="jobs" className="py-20 bg-gradient-to-br from-white to-blue-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <div className="inline-block mb-6 p-2 bg-blue-100 rounded-xl">
                                <span className="text-blue-600 font-medium text-sm px-3">Karir</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Posisi Terbuka</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">Bergabunglah dengan tim kami dan menjadi bagian dari sesuatu yang istimewa.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {vacancies.map((job, index) => (
                                <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-xl mb-2 text-blue-900">{job.title}</h3>
                                        <div className="text-gray-500 mb-6 flex items-center space-x-2">
                                            <span className="inline-block px-2 py-1 bg-blue-50 rounded-md text-xs text-blue-600">{job.department}</span>
                                            <span>•</span>
                                            <span className="text-sm">{job.location}</span>
                                        </div>
                                        <ul className="list-disc list-inside text-gray-600 mb-4">
                                            {job.requirements.map((requirement, reqIndex) => (
                                                <li key={reqIndex}>{requirement}</li>
                                            ))}
                                            {job.benefits && job.benefits.length > 0 && (
                                                <li className=''>Benefit: {job.benefits.join(', ')}</li>
                                            )}
                                        </ul>
                                    </div>
                                    <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-200 transition-all text-white w-full mt-4">
                                        Lihat detail
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-6 rounded-xl shadow-md text-white">Lihat Semua Posisi</Button>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="max-w-3xl mx-auto bg-blue-600 rounded-2xl p-10 text-center shadow-xl shadow-blue-200">
                            <h2 className="text-3xl font-bold mb-4 text-white">Siap Bergabung dengan Tim Kami?</h2>
                            <p className="text-blue-100 mb-8 max-w-lg mx-auto">
                                Ambil langkah pertama menuju karir yang memuaskan di PT MITRA KARYA ANALITIKA.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-6 rounded-xl">Lamar Sekarang</Button>
                                <Button className="border border-blue-300 text-white hover:bg-blue-700 px-6 py-6 rounded-xl bg-transparent">Hubungi Kami</Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-10 border-t border-gray-100 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-6 md:mb-0 flex items-center space-x-2">
                                <div className="bg-blue-600 w-8 h-8 rounded-md flex items-center justify-center">
                                    <span className="text-white font-bold">MKA</span>
                                </div>
                                <span className="font-semibold">PT MITRA KARYA ANALITIKA</span>
                            </div>
                            <div className="mb-6 md:mb-0 flex gap-8">
                                <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Tentang</a>
                                <a href="#jobs" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Karir</a>
                                <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Kontak</a>
                            </div>
                            <div className="flex space-x-6">
                                <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                        <rect x="2" y="9" width="4" height="12"></rect>
                                        <circle cx="4" cy="4" r="2"></circle>
                                    </svg>
                                </a>
                                <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                            <span className="text-sm text-gray-500">© {new Date().getFullYear()} PT MITRA KARYA ANALITIKA. Semua hak dilindungi.</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}