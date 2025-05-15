import React, { useEffect, useState } from 'react';
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { vacancies } = props;
    const { auth } = usePage<SharedData>().props;

    const backgroundImages = [
        "/images/slider1.png",
        "/images/slider2.png",
        "/images/slider3.png",
        "/images/slider4.png",
    ];

    const jobList = [
        {
          title: "Data Analyst",
          department: "Data",
          deadline: "25 Maret 2025"
        },
        {
          title: "Software Engineer",
          department: "Engineering",
          deadline: "30 Maret 2025"
        },
        {
          title: "Game Developer",
          department: "Creative",
          deadline: "5 April 2025"
        },
        {
          title: "Penetration Tester",
          department: "Security",
          deadline: "10 April 2025"
        },
        {
          title: "UI/UX Designer",
          department: "Design",
          deadline: "15 April 2025"
        },
        {
          title: "Project Manager",
          department: "Management",
          deadline: "20 April 2025"
        },
      ];

      const benefitCards = [
        {
          title: "Lingkungan Kerja Profesional",
          description: "Kami menciptakan budaya kerja yang kolaboratif dan mendukung perkembangan karier setiap karyawan.",
          icon: "/images/benefit1.png"
        },
        {
          title: "Inovasi dan Teknologi",
          description: "Bergabunglah dengan tim yang selalu beradaptasi dengan teknologi terbaru dan menghadirkan solusi terbaik bagi pelanggan.",
          icon: "/images/benefit2.png"
        },
        {
          title: "Benefit Kompetitif",
          description: "Kami menawarkan kompensasi dan tunjangan yang menarik sesuai dengan kinerja dan kontribusi Anda.",
          icon: "/images/benefit3.png"
        },
        {
          title: "Kesempatan Berkembang",
          description: "Kami menyediakan pelatihan dan pengembangan berkelanjutan untuk meningkatkan keterampilan dan kompetensi Anda.",
          icon: "/images/benefit4.png"
        },
      ];
      

    const [bgIndex, setBgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=outfit:300,400,500,600" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
            </Head>
            <div className="min-h-screen bg-white text-gray-900">
                {/* Navbar */}
                <header className="fixed top-0 right-0 left-0 z-50 h-[80px] border-b border-gray-200 bg-white px-[20px] shadow">
                    <div className="container mx-auto flex items-center justify-between px-6 py-4">
                        <div className="text-[20px] font-bold text-gray-800">MITRA KARYA GROUP</div>
                        

                        <nav className="hidden space-x-[24px] text-[14px] font-medium md:flex">
                          <Link href="/" className="hover:text-blue-600">Beranda</Link>
                          <Link href="/lowongan-pekerjaan" className="hover:text-blue-600">Lowongan Pekerjaan</Link>
                          <Link href="/tentang" className="hover:text-blue-600">Tentang Kami</Link>
                          <Link href="/kontak" className="hover:text-blue-600">Kontak</Link>
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
                <section className="relative h-[1400px] pt-[128px] pb-[80px] text-center text-white">
                    {/* Background image slideshow */}
                    {backgroundImages.map((img, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === bgIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'}`}
                            style={{ backgroundImage: `url(${img})` }}
                        />
                    ))}
                    {/* Black overlay */}
                    <div className="absolute inset-0 bg-black opacity-60 z-10" />
                    <div className="relative z-20 container mx-auto flex h-full flex-col items-center justify-center px-6">
                        <h1 className="mb-[16px] text-[36px] font-bold md:text-[56px]">
                            Selamat Datang di E-Recruitment
                            <br />
                            Mitra Karya Group
                        </h1>
                        <p className="mb-[32px] text-[18px]">Temukan Karier Impian Anda Bersama Kami</p>
                        <div className="flex justify-center gap-4">
                            <Button
                                className="rounded-md bg-blue-600 px-[24px] py-[12px] text-white hover:bg-blue-700"
                                onClick={() => scrollToSection('lowongan')}
                            >
                                Lihat Lowongan
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-md border border-white px-[24px] py-[12px] text-white hover:bg-white hover:text-blue-600"
                            >
                                Tentang Kami
                            </Button>
                        </div>
                    </div>
                </section>

               {/* Section Kenapa Bergabung dengan Ikon Gambar */}
                <section className="bg-white py-20 text-left">
                    <div className="container mx-auto px-6">
                        <h2 className="mb-[16px] text-[24px] font-bold md:text-[32px] text-center">MENGAPA BERGABUNG DENGAN MITRA KARYA GROUP?</h2>
                        <p className="mx-auto mb-[48px] max-w-[672px] text-[16px] text-gray-600 text-center">
                            Kami menawarkan lingkungan kerja yang mendukung, peluang pengembangan karier, serta benefit kompetitif.
                        </p>
                        <div className="grid grid-cols-1 justify-center gap-[100px] px-[100px] sm:grid-cols-2 md:grid-cols-4">
                            {benefitCards.map((card, index) => (
                                <div
                                    key={index}
                                    className="flex h-[261px] w-full max-w-[245px] flex-col justify-start rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                                >
                                    <img src={card.icon} alt={card.title} className="mb-3 w-10 h-10 object-contain" />
                                    <h3 className="mb-2 font-semibold text-gray-800">{card.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* Perusahaan Kami & Lowongan */}
                <section className="py-[80px] text-center">
                    <div className="container mx-auto px-6">
                        <h2 className="mb-[40px] text-[24px] font-bold md:text-[32px]">Perusahaan Kami</h2>
                        <div className="mb-[40px] flex flex-col justify-center gap-[60px] md:flex-row">
                        <div className="w-[528px] mx-auto text-left flex items-start gap-4">
  <img src="/images/autentik-logo.png" alt="PT AUTENTIK" className="w-[60px] h-[60px] mt-1" />
  <div>
    <h3 className="font-semibold mb-1">PT AUTENTIK KARYA ANALITIKA</h3>
    <p className="text-sm text-gray-600">
      Adalah perusahaan teknologi pintar yang senantiasa berkomitmen untuk memberikan dan meningkatkan kepuasan pelanggan
    </p>
  </div>
</div>

<div className="w-[528px] mx-auto text-left flex items-start gap-4">
  <img src="/images/mitra-logo.png" alt="PT AUTENTIK" className="w-[60px] h-[60px] mt-1" />
  <div>
    <h3 className="font-semibold mb-1">PT MITRA KARYA ANALITIKA</h3>
    <p className="text-sm text-gray-600">
    Bergerak dibidang Distribusi Kebutuhan Laboratorium, Cleanroom, Water and Waste Water Treatment Plant.
    </p>
  </div>
</div>

                        </div>
                        <Button className="rounded-md border border-blue-600 bg-white px-[24px] py-[12px] text-blue-600 hover:bg-blue-50">
                            Tentang Kami →
                        </Button>
                    </div>
                </section>

                <section className="bg-[#f6fafe] py-[80px] text-center">
  <div className="container mx-auto px-6">
    <h2 className="mb-[16px] text-[24px] font-bold md:text-[32px]">LOWONGAN PEKERJAAN TERSEDIA</h2>
    <p className="mx-auto mb-[40px] max-w-[672px] text-[16px] text-gray-600">
      Temukan posisi yang sesuai dengan minat dan keahlian Anda di PT Mitra Karya Analitika. Kami membuka peluang karier di
      berbagai bidang, seperti:
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-[40px]">
      {jobList.map((job, i) => (
        <div
          key={i}
          className="mx-auto flex h-auto w-[400px] flex-col rounded-xl border border-gray-200 bg-white px-6 pt-6 pb-4 shadow hover:shadow-md text-left"
        >
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-[18px] font-semibold">{job.title}</h3>
            <span className="rounded bg-blue-100 px-2 py-[2px] text-[12px] font-medium text-blue-600">
              {job.department}
            </span>
          </div>
          <div className="mb-3 text-[12px] text-gray-600">
            PT MITRA KARYA ANALITIKA • Lamar Sebelum: {job.deadline}
          </div>
          <ul className="mb-4 list-disc pl-5 text-sm text-gray-700">
            <li>Minimal S1 di bidang IT/Komputer</li>
            <li>Berpengalaman di bidang terkait</li>
            <li>Menguasai bahasa pemrograman atau analisis data</li>
            <li>Mampu bekerja dalam tim.</li>
          </ul>
          <Button className="w-full rounded bg-[#1976f2] py-[10px] text-sm text-white hover:bg-[#125bd1]">
            Lihat Detail
          </Button>
        </div>
      ))}
    </div>
    <Button className="rounded-md bg-blue-100 px-[24px] py-[12px] text-blue-600 hover:bg-blue-200">
      Lihat Semua Lowongan →
    </Button>
  </div>
</section>

                {/* Cara Mendaftar */}
                <section className="py-[80px] bg-white text-center">
  <div className="container mx-auto px-6 relative">
    <h2 className="text-[24px] md:text-[32px] font-bold mb-4">Cara Mendaftar</h2>
    <p className="text-gray-600 text-[16px] mb-16 max-w-[768px] mx-auto">
      Mohon persiapkan terlebih dahulu seluruh data pribadi Anda termasuk pendidikan, pengalaman kerja, organisasi, serta data penunjang lainnya
    </p>

    {/* Wrapper dengan garis horizontal */}
   {/* Wrapper dengan garis horizontal dibatasi antara step 1 dan step 4 */}
<div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
  {/* Garis horizontal hanya antara step 1–4 */}
  <div className="absolute hidden md:block top-[22px] left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-purple-400 to-violet-500 z-0" />

  {[{
    number: 1,
    title: 'Daftar & Buat Profil',
    desc: 'Klik tombol Daftar dan buat CV Anda dengan melengkapi bagian profil'
  }, {
    number: 2,
    title: 'Cari Lowongan',
    desc: 'Temukan posisi yang sesuai dengan minat dan kualifikasi Anda.'
  }, {
    number: 3,
    title: 'Kirim Lamaran',
    desc: 'Ajukan lamaran Anda secara online dengan mudah dan cepat.'
  }, {
    number: 4,
    title: 'Proses Seleksi',
    desc: 'Jika memenuhi kriteria, tim HR kami akan menghubungi Anda untuk tahap seleksi lebih lanjut.'
  }].map((step) => (
    <div key={step.number} className="relative z-10 flex flex-col items-center text-center px-2">
      <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold mb-4">
        {step.number}
      </div>
      <h3 className="text-[16px] font-semibold mb-2">{step.title}</h3>
      <p className="text-sm text-gray-600 max-w-[240px]">{step.desc}</p>
    </div>
  ))}
</div>

  </div>
</section>


<section className="py-[80px]">
  <div className="container mx-auto px-6">
    <div className="relative overflow-hidden rounded-[24px] bg-black">
      <img
        src="/images/siap-bergabung.png"
        alt="Bergabung"
        className="h-[300x] w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-white text-center">
        <h2 className="mb-4 text-[28px] font-bold md:text-[36px]">Siap untuk Bergabung?</h2>
        <p className="mb-6 max-w-[560px] text-[14px] md:text-[16px]">
          Jangan lewatkan kesempatan untuk menjadi bagian dari tim PT Mitra Karya Analitika.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Button className="rounded-md bg-white px-6 py-3 text-blue-600 hover:bg-blue-50">
            Lihat Lowongan
          </Button>
          <Button className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
            Tentang Kami
          </Button>
        </div>
      </div>
    </div>
  </div>
</section>

                {/* Footer */}
                <footer className="bg-[#f6fafe] py-16">
                    <div className="container mx-auto grid grid-cols-1 gap-10 px-6 md:grid-cols-3">
                        {/* Kolom 1 */}
                        <div>
                            <h4 className="mb-2 text-[16px] font-bold">PT MITRA KAYA ANALITIKA</h4>
                            <p className="mb-6 text-sm text-gray-700">
                                Kami adalah perusahaan teknologi pintar yang senantiasa berkomitmen untuk memberikan dan meningkatkan kepuasan
                                pelanggan
                            </p>
                            <div className="flex space-x-4 text-xl text-blue-600">
                                <a href="#">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#">
                                    <i className="fab fa-x-twitter"></i>
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
                            <h4 className="mb-2 text-[16px] font-bold">Perusahaan Kami</h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                                <li>PT MITRA KARYA ANALITIKA</li>
                                <li>PT AUTENTIK KARYA ANALITIKA</li>
                            </ul>
                        </div>

                        {/* Kolom 3 */}
                        <div>
                            <h4 className="mb-4 text-[16px] font-bold">Contact</h4>
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
            </div>
        </>
    );
}
