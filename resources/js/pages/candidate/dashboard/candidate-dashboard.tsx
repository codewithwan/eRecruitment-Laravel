  import React, { useState, useEffect } from 'react';
  import { Phone, Mail, MapPin } from 'lucide-react';

  function Dashboard() {
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
      const metaViewport = document.createElement('meta');
      metaViewport.name = "viewport";
      metaViewport.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
      document.head.appendChild(metaViewport);
  
      return () => {
        document.head.removeChild(metaViewport);
      };
    }, []);

    const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
    };

    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white p-4 sticky top-0 z-50">
          <div className="container mx-auto px-8">
            <div className="flex justify-between items-center">
              {/* Kiri: Logo */}
              <div className="font-bold text-xl text-blue-600">MITRA KARYA GROUP</div>
              {/* Tengah: Menu Navigasi */}
              <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
                <a href="/candidate/dashboard" className="font-medium text-gray-600 hover:text-gray-900">Dasbor</a>
                <a href="/candidate/profile" className="font-medium text-gray-600 hover:text-gray-900">Profil</a>
                <a href="/candidate/jobs" className="font-medium text-gray-600 hover:text-gray-900">Lowongan Pekerjaan</a>
                <a href="/candidate/application-history" className="font-medium text-gray-600 hover:text-gray-900">Lamaran</a>
              </div>

              {/* Kanan: Profil Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="w-10 h-10 border-3 border-[#0047FF] rectangled-full flex items-center justify-center text-[#0047FF]"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
                {showDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded border border-gray-200 z-10 focus:outline focus:outline-2 focus:outline-[#0047FF]"
                    tabIndex={0} // agar bisa focus dan outline muncul saat klik
                  >
                    <div className="p-4  border-b flex items-center space-x-3">
                      <div className="w-10 h-10 border-3 border-[#0047FF] rectangled-full flex items-center justify-center text-[#0047FF]">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[#0047FF] font-bold">PUTRI ANGRAENI</div>
                        <div className="text-gray-600 text-sm font-medium">
                          putriangraeni@gmail.com
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <a href="/candidate/profile" className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black">
                        Profil Saya
                      </a>
                      <a href="/candidate/jobs" className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black">
                        Lowongan Pekerjaan
                      </a>
                      <a href="/candidate/application-history" className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black">
                        Lamaran
                      </a>
                      <form method="POST" action="/logout">
                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                        <button type="submit" className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black">
                          Logout
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-12 px-4 mb-26">
          <h1 className="text-6xl text-blue-500 font-bold text-center mt-12 mb-15" style={{ fontFamily: 'Roboto'}}>Dasbor Pekerjaan</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 m-24">
            {/* Profil Card */}
            <a href="/candidate/profile" className="w-[90%] max-w-md mx-auto border border-blue-800 rounded p-6 flex flex-col items-start bg-white hover:shadow-md transition outline outline-2 outline-[#0047FF] cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-medium mb-2 text-black">Profil</h2>
              <p className="text-gray-600 text-start font-medium">Lengkapi Biodata Profil Anda</p>
            </a>

            {/* Lowongan Pekerjaan Card */}
            <a href="/candidate/jobs" className="w-[90%] max-w-md mx-auto border border-blue-800 rounded p-6 flex flex-col items-start bg-white hover:shadow-md transition outline outline-2 outline-[#0047FF] cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-medium mb-2 text-black">Lowongan Pekerjaan</h2>
              <p className="text-gray-600 text-start font-medium">Lihat lowongan pekerjaan yang tersedia di sini</p>
            </a>

            {/* Lamaran Card */}
            <a href="/candidate/application-history" className="w-[90%] max-w-md mx-auto border border-blue-800 rounded p-6 flex flex-col items-start bg-white hover:shadow-md transition outline outline-2 outline-[#0047FF] cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-medium mb-2 text-black">Lamaran</h2>
              <p className="text-gray-600 text-start font-medium">Lihat riwayat lamaran pekerjaan Anda di sini.</p>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-green-50 py-12 mt-20 ">
          <div className="container mx-auto px-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-black text-lg mb-4">PT MITRA KAYA ANALITIKA</h3>
                <p className="text-gray-600 mb-4 font-normal">
                  Kami adalah perusahaan teknologi pintar yang <br />
                  senantiasa berkomitmen untuk memberikan  <br />
                  dan meningkatkan kepuasan pelanggan
                </p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="text-blue-500 hover:text-blue-700">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="#" className="text-blue-500 hover:text-blue-700">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5 3h3.5l-7.5 8 8 10h-6l-5-6-5 6H2l8-9-8-9h6l4.5 5L17.5 3z" />
                    </svg>
                  </a>
                  <a href="#" className="text-blue-500 hover:text-blue-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                    </svg>
                  </a>
                  <a href="#" className="text-blue-500 hover:text-blue-700">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </a>
                  <a href="#" className="text-blue-500 hover:text-blue-700">
                    <svg className="w-6 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-black text-lg mb-4">Perusahaan Kami</h3>
                <p className="text-gray-600 mb-2 font-normal">PT MITRA KARYA ANALITIKA</p>
                <p className="text-gray-600 font-normal">PT AUTENTIK KARYA ANALITIKA</p>
              </div>

              <div>
                <h3 className="font-bold text-black text-lg mb-4">Contact</h3>
                <div className="flex items-start space-x-3 mb-2">
                  <Phone className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="text-gray-600 font-normal">Rudy Alfansyah : 082137384029</p>
                    <p className="text-gray-600 font-normal">Deden Dermawan : 081807700111</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 mb-2">
                  <Mail className="w-5 h-5 text-blue-500 mt-1" />
                  <p className="text-gray-600 font-normal">autentik.info@gmail.com</p>
                </div>
                <div className="flex items-start space-x-3 mb">
                  <MapPin className="w-9 h-9 text-blue-500 mt-1" />
                  <p className="text-gray-600 font-normal">
                    Jl. Klipang Ruko Amsterdam No.9E, Sendangmulyo,
                    Kec. Tembalang, Kota Semarang, Jawa Tengah 50272
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default Dashboard;
