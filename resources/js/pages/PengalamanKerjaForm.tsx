import React from 'react';

interface PengalamanKerjaFormProps {
    onTambahPengalaman: () => void;
}

const PengalamanKerjaForm: React.FC<PengalamanKerjaFormProps> = ({ onTambahPengalaman }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-600">Pengalaman Kerja</h2>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    Apakah Anda memiliki pengalaman kerja? Jika ya, lengkapi pengalaman kerja Anda dari yang paling terbaru
                </p>
            </div>

            <div className="p-6 space-y-6">
                <button
                    type="button"
                    onClick={onTambahPengalaman}
                    className="text-blue-600 flex items-center space-x-2 hover:text-blue-700"
                >
                    <span>+ Tambah Pengalaman Kerja</span>
                </button>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Save & Next
                </button>
            </div>
        </div>
    );
};

export default PengalamanKerjaForm;