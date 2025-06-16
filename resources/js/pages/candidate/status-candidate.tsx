

// === Ikon SVG ===
// Definisi semua ikon yang digunakan di dalam satu file.

const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 text-gray-700">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-3 flex-shrink-0">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);


// === Komponen Halaman Status Kandidat ===
// Seluruh UI dan logika digabungkan dalam satu komponen.
export default function StatusCandidatePage() {
    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">

                <header className="flex justify-between items-center py-4 border-b border-gray-200">
                    <h1 className="text-lg font-bold text-gray-800">MITRA KARYA GROUP</h1>
                    <nav className="hidden sm:flex items-center space-x-6 text-sm font-medium text-gray-600">
                        <a href="#" className="hover:text-blue-600">Profil</a>
                        <a href="#" className="hover:text-blue-600">Lowongan Pekerjaan</a>
                        <a href="#" className="hover:text-blue-600">Lamaran</a>
                    </nav>
                     <div className="sm:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </div>
                </header>

                <main className="mt-8">
                    {/* --- Informasi Pelamar --- */}
                    <section className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-center space-x-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold flex-shrink-0">
                            Z
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Zayyan</h2>
                            <p className="text-gray-600 mt-1">Posisi yang dilamar: <span className="font-semibold">Hardware Engineer</span></p>
                            <p className="text-gray-700 font-semibold">PT MITRA KARYA ANALITIKA</p>
                            <a href="#" className="text-blue-600 text-sm font-semibold mt-2 inline-block hover:underline">
                                Lihat detail lamaran Anda
                            </a>
                        </div>
                    </section>

                    {/* --- Tahapan Rekrutmen --- */}
                    <section className="mt-10">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <BriefcaseIcon />
                            Tahapan Rekrutmen
                        </h3>

                        <div className="space-y-4">
                            {/* Card 1: Seleksi Administrasi */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-800">Seleksi Administrasi</h4>
                                        <p className="text-sm text-gray-500 mt-1">Telah selesai pada 8 Mar 2025</p>
                                    </div>
                                    <span className="text-xs font-bold text-green-700 bg-green-100 border border-green-300 px-3 py-1 rounded-full">Selesai</span>
                                </div>
                            </div>

                            {/* Card 2: Tes Psikotes (dengan detail) */}
                            <div className="bg-white border-2 border-blue-500 rounded-xl p-1 shadow-md">
                                 <div className="p-4">
                                     <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-800">Tes Psikotes</h4>
                                            <p className="text-sm text-gray-500 mt-1">Dijadwalkan pada 12 Mar 2025, 09:30 WIB</p>
                                        </div>
                                        <span className="text-xs font-bold text-blue-700 bg-blue-100 border border-blue-300 px-3 py-1 rounded-full">Terjadwal</span>
                                    </div>
                                </div>
                                <div className="border-t-2 border-blue-500 border-dashed mx-1"></div>
                                <div className="p-5">
                                    <p className="font-semibold text-gray-700">Detail:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-3 text-sm">
                                        <div>
                                            <p className="text-gray-500">Tanggal & Waktu</p>
                                            <p className="font-semibold text-gray-800">12 Mar 2025, 09:30 WIB</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Lokasi</p>
                                            <p className="font-semibold text-gray-800">Online (via link tes)</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Jenis Tes</p>
                                            <p className="font-semibold text-gray-800">Tes Kepribadian (MBTI) & Kemampuan Logika</p>
                                        </div>
                                         <div>
                                            <p className="text-gray-500">Durasi</p>
                                            <p className="font-semibold text-gray-800">120 Menit</p>
                                        </div>
                                    </div>

                                    <p className="font-semibold text-gray-700 mt-6">Tips Mengikuti Tes:</p>
                                    <ul className="list-disc list-outside pl-5 mt-2 space-y-1 text-sm text-gray-600">
                                        <li>Pastikan Anda istirahat, berada di tempat yang cukup sebelum mengikuti tes.</li>
                                        <li>Pastikan koneksi internet stabil agar tes berjalan lancar.</li>
                                        <li>Gunakan laptop atau PC dengan browser Google Chrome versi terbaru.</li>
                                        <li>Cari waktu serta lokasi yang sepi, tidak berisik, dan pencahayaan cukup agar lebih fokus.</li>
                                    </ul>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 text-sm">
                                        <p className="font-bold text-blue-800">Pesan dari Tim Rekrutmen:</p>
                                        <p className="text-blue-700 mt-1">Selamat, Anda telah mencapai tahap ini dalam proses rekrutmen. Berfokuslah pada kemampuan Anda dan tunjukkan antusiasme Anda. Semoga sukses.</p>
                                    </div>
                                     <div className="text-right mt-4">
                                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                                            Lanjut ke Persiapan Tes &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Seleksi Wawancara */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm opacity-60">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-800">Seleksi Wawancara</h4>
                                        <p className="text-sm text-gray-500 mt-1">Menunggu penyelesaian tahap sebelumnya</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- Persiapan Tes Psikotes --- */}
                    <section className="mt-12 bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800">Persiapan Tes Psikotes</h3>
                        <p className="text-sm text-gray-600 mt-2">Beberapa hal yang perlu dipersiapkan sebelum tes.</p>
                        <p className="text-sm text-gray-600 mt-2">Tes psikotes akan menilai kemampuan kognitif dan kepribadian Anda untuk memastikan kecocokan dengan posisi dan budaya perusahaan. Kami menyarankan agar Anda:</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                            <div>
                                <h4 className="font-semibold text-gray-800 border-b pb-2">Sebelum Hari Tes</h4>
                                <ul className="mt-4 space-y-3 text-sm text-gray-700">
                                    <li className="flex items-start"><CheckIcon /> Lakukan penelitian mendalam mengenai perusahaan serta posisi yang dilamar.</li>
                                    <li className="flex items-start"><CheckIcon /> Persiapkan berkas dan data yang diperlukan, seperti KTP, CV, dan ijazah.</li>
                                    <li className="flex items-start"><CheckIcon /> Latih diri dengan mengerjakan contoh soal-soal tes serupa.</li>
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold text-gray-800 border-b pb-2">Saat Hari Tes</h4>
                                <ul className="mt-4 space-y-3 text-sm text-gray-700">
                                    <li className="flex items-start"><CheckIcon /> Masuk ke soal wawancara 30 menit sebelum jadwal yang ditentukan.</li>
                                    <li className="flex items-start"><CheckIcon /> Berpakaian rapi dengan kemeja dan celana bahan yang berfungsi dengan baik.</li>
                                    <li className="flex items-start"><CheckIcon /> Pastikan koneksi internet dalam kondisi stabil.</li>
                                    <li className="flex items-start"><CheckIcon /> Pilih ruangan yang tenang dan bebas dari gangguan.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8 text-sm text-yellow-800 italic">
                             <p>"Kejujuran adalah nilai inti dalam perusahaan kami, mohon menjawab pertanyaan tes secara jujur. Jawaban yang tidak hanya mencerminkan keinginan perusahaan, tetapi juga kesesuaian dengan nilai-nilai dan budaya perusahaan, adalah apa yang akan kami hargai. Dengan menjawab jujur, Anda menunjukkan integritas personal Anda."</p>
                             <p className="font-semibold text-right mt-2 not-italic">- Tim Rekrutmen</p>
                        </div>
                    </section>

                     <footer className="mt-8 py-6 border-t border-gray-200 flex justify-end">
                         <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105">
                             Mulai Mengerjakan
                         </button>
                     </footer>
                </main>
            </div>
        </div>
    );
}
