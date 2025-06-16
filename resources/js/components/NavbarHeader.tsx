import React, { useState } from 'react';

const NavbarHeader: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-8">
        <div className="flex justify-between items-center">
          {/* Kiri: Logo */}
          <div className="font-bold text-xl text-blue-600">MITRA KARYA GROUP</div>
          {/* Tengah: Menu Navigasi */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
            <a href="#" className="font-medium text-gray-600 hover:text-gray-900">Dasbor</a>
            <a href="#" className="font-medium text-gray-600 hover:text-gray-900">Profil</a>
            <a href="/candidate/jobs" className="font-medium text-gray-600 hover:text-gray-900">Lowongan Pekerjaan</a>
            <a href="#" className="font-medium text-gray-600 hover:text-gray-900">Lamaran</a>
          </div>
          {/* Kanan: Profil Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="w-10 h-10 border-2 border-[#0047FF] rounded-full flex items-center justify-center text-[#0047FF]"
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
                tabIndex={0}
              >
                <div className="p-4 border-b flex items-center space-x-3">
                  <div className="w-10 h-10 border-2 border-[#0047FF] rounded-full flex items-center justify-center text-[#0047FF]">
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
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black">
                    Profil Saya
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarHeader;
