import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

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

interface CompanySliderProps {
    title: string;
    description: string;
    images: string[];
    infoLink: string;
}

interface AboutUsData {
    id: number;
    company_id: number;
    vision: string;
    mission: string;
    created_at: string;
    updated_at: string;
    company?: {
        id: number;
        name: string;
    };
}

interface AboutUsProps {
    aboutUs: AboutUsData[];
}

const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const CompanySlider: React.FC<CompanySliderProps> = ({ title, description, images, infoLink }) => {
    const [swiperInstance, setSwiperInstance] = React.useState<SwiperClass | null>(null);

    return (
        <div className="w-full bg-white py-12">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-4 md:grid-cols-2">
                {/* KIRI: Teks */}
                <div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 !text-gray-800">{title}</h2>
                    <p className="mb-6 text-sm text-gray-600">{description}</p>
                    <div className="flex items-center gap-4">
                        <button onClick={() => swiperInstance?.slidePrev()} className="rounded-md bg-blue-500 px-3 py-2 text-white">
                            <ChevronLeft />
                        </button>
                        <button onClick={() => swiperInstance?.slideNext()} className="rounded-md bg-blue-500 px-3 py-2 text-white">
                            <ChevronRight />
                        </button>
                    </div>
                </div>

                {/* KANAN: Swiper */}
                <Swiper
                    modules={[Navigation]}
                    navigation={false}
                    spaceBetween={16}
                    slidesPerView={2}
                    className="w-full !pb-8"
                    onSwiper={(swiper) => setSwiperInstance(swiper)}
                >
                    {images && images.length > 0 ? (
                        images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <img src={image} alt={`Slide ${index + 1}`} className="h-64 w-full rounded-xl object-cover" />
                            </SwiperSlide>
                        ))
                    ) : (
                        <SwiperSlide>
                            <div className="flex h-64 w-full items-center justify-center rounded-xl bg-gray-200">
                                <span className="text-gray-500">No Images Available</span>
                            </div>
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>
            {/* TOMBOL DI TENGAH */}
            <div className="mt-8 flex justify-center">
                <a
                    href={infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
                >
                    Company Info →
                </a>
            </div>
        </div>
    );
};

export default function AboutUs(props: AboutUsProps) {
    const { auth } = usePage<{ auth: { user: unknown } }>().props;

    return (
        <>
            {/* Navbar */}
            <header className="fixed top-0 right-0 left-0 z-[1000] h-[80px] border-b border-gray-200 bg-white px-[20px] shadow">
                <div className="container mx-auto flex items-center justify-between px-6 py-4">
                    <div className="text-[20px] font-bold text-gray-800">MITRA KARYA GROUP</div>
                    <nav className="hidden space-x-[24px] text-[14px] font-medium md:flex text-gray-800">
                        <Link href="/" className="hover:text-blue-600">Beranda</Link>
                        <Link href="/job-hiring-landing-page" className="hover:text-blue-600">Lowongan Pekerjaan</Link>
                        <Link href="/about-us" className="hover:text-blue-600">Tentang Kami</Link>
                        <Link href="/contact" className="hover:text-blue-600">Kontak</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-md border border-blue-600 px-[16px] py-[10px] text-[14px] font-medium text-blue-600 hover:bg-blue-50"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-sm font-medium text-blue-600 hover:underline">Masuk</Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-blue-600 px-[16px] py-[10px] text-[14px] text-white hover:bg-blue-700"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section
                id="about"
                className="relative flex h-[80vh] items-center justify-center bg-cover bg-center pt-[80px] text-white"
                style={{ backgroundImage: "url('/images/1.PNG')" }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 px-6 text-center">
                    <h1 className="mb-4 text-5xl font-bold">TENTANG KAMI</h1>
                    <p className="mx-auto max-w-2xl text-lg mb-4">
                        Mitra Karya Group adalah perusahaan yang bergerak di bidang teknologi dan layanan inovatif, berkomitmen untuk memberikan solusi terbaik bagi pelanggan di seluruh Indonesia.
                    </p>
                    <p className="mx-auto max-w-2xl text-lg">
                        Kami percaya pada pentingnya inovasi, kualitas sumber daya manusia, dan kontribusi terhadap kemajuan teknologi untuk menciptakan nilai tambah bagi masyarakat dan mitra bisnis kami.
                    </p>
                </div>
            </section>

            {/* Tentang Kami Section */}
            <section className="relative bg-white pt-20 pb-20 text-gray-800">
                <div className="relative z-10 px-6 text-center">
                    <h1 className="mb-4 text-5xl font-bold text-blue-600">MITRA KARYA GROUP</h1>
                    {props.aboutUs[0] && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-2">Visi</h2>
                            <p className="mb-4">{props.aboutUs[0].vision}</p>
                            <h2 className="text-2xl font-bold mb-2">Misi</h2>
                            <p>{props.aboutUs[0].mission}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Company Profile Section */}
            <section className="bg-blue-50 px-6 py-12">
                <div className="container mx-auto flex flex-col items-center gap-10 md:flex-row">
                    <div className="relative w-full md:w-1/2">
                        <img src="/images/11.PNG" alt="Video Thumbnail" className="h-72 w-full rounded-lg object-cover shadow-md" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white shadow-lg">
                                ▶
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 w-full text-center md:mt-0 md:w-1/2 md:text-left">
                        <h2 className="mb-4 text-2xl font-bold text-gray-800">Company Profile</h2>
                        <p className="leading-relaxed text-gray-700">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend, lectus quis pellentesque dapibus. Lorem ipsum
                            dolor sit amet, consectetur adipiscing elit. Integer eleifend, lectus quis pellentesque dapibus. Lorem ipsum dolor sit
                            amet, consectetur adipiscing elit. Integer eleifend, lectus quis pellentesque dapibus. Lorem ipsum dolor sit amet,
                            consectetur adipiscing elit. Integer eleifend, lectus quis pellentesque dapibus.
                        </p>
                    </div>
                </div>
            </section>

            {/* Slider Section */}
            <CompanySlider
                title="PT MITRA KARYA ANALITIKA"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend, lectus quis pellentesque dapibus."
                images={['/images/1.PNG', '/images/13.PNG', '/images/12.PNG', '/images/14.PNG', '/images/15.PNG']}
                infoLink="https://mikacares.co.id/"
            />
            <CompanySlider
                title="PT AUTENTIK KARYA ANALITIKA"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend, lectus quis pellentesque dapibus."
                images={['/images/1.PNG', '/images/13.PNG', '/images/12.PNG', '/images/14.PNG', '/images/15.PNG']}
                infoLink="https://autentik.co.id/"
            />
            {/* Footer */}
            <footer className="bg-[#f6fafe] py-16">
                    <div className="container mx-auto grid grid-cols-1 gap-10 px-6 md:grid-cols-3">
                        {/* Kolom 1 */}
                        <div>
                            <h4 className="mb-2 text-[16px] font-bold text-gray-800">MITRA KARYA GROUP</h4>
                            <p className="mb-6 text-sm text-gray-700">
                                Kami adalah perusahaan teknologi pintar yang senantiasa berkomitmen untuk memberikan dan meningkatkan kepuasan
                                pelanggan
                            </p>
                            <div className="flex space-x-4 text-xl text-blue-600">
                                <a href="#">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#">
                                    <i className="fab fa-x"></i>
                                </a>
                                <a href="#">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                                <a href="#">
                                    <i className="fab fa-youtube"></i>
                                </a>
                                <a href="#">
                                    <i className="fab fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>

                        {/* Kolom 2 */}
                        <div>
                            <h4 className="mb-2 text-[16px] font-bold text-gray-800">Perusahaan Kami</h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                                <li>PT MITRA KARYA ANALITIKA</li>
                                <li>PT AUTENTIK KARYA ANALITIKA</li>
                            </ul>
                        </div>

                        {/* Kolom 3 */}
                        <div>
                            <h4 className="mb-4 text-[16px] font-bold text-gray-800">Contact</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <i className="fas fa-phone mt-1 text-blue-600" />
                                    <div>
                                        Rudy Alfiansyah: 082137384029
                                        <br />
                                        Deden Dermawan: 081807700111
                                    </div>
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="fas fa-envelope text-blue-600" />
                                    <span>autentik.info@gmail.com</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <i className="fas fa-map-marker-alt mt-1 text-blue-600" />
                                    <span>
                                        Jl. Klipang Ruko Amsterdam No.9E, Sendangmulyo,
                                        <br />
                                        Kec. Tembalang, Kota Semarang, Jawa Tengah 50272
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </footer>
        </>
    );
}
