import React from 'react';

const NavbarHeader: React.FC = () => {
    return (
        <nav className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-black">MITRA KARYA GROUP</h1>
                    </div>

                    <div className="flex items-center space-x-8">
                        <a href="#" className="text-gray-700 hover:text-gray-900">Dasbor</a>
                        <a href="#" className="text-gray-700 hover:text-gray-900">Profil</a>
                        <a href="#" className="text-gray-700 hover:text-gray-900">Lowongan Pekerjaan</a>
                        <a href="#" className="text-gray-700 hover:text-gray-900">Lamaran</a>
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavbarHeader;