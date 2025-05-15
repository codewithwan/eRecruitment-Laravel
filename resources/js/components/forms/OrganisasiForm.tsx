import React from 'react';

interface OrganisasiFormProps {
    onTambahOrganisasi: () => void;
}

const OrganisasiForm: React.FC<OrganisasiFormProps> = ({ onTambahOrganisasi }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-600">Organisasi</h2>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    Apakah Anda memiliki pengalaman dalam berorganisasi? Jika iya, beritahu kami
                </p>
            </div>

            <div className="p-6 space-y-6">
                <button
                    type="button"
                    onClick={onTambahOrganisasi}
                    className="text-blue-600 flex items-center space-x-2 hover:text-blue-700"
                >
                    <span>+ Tambah Organisasi</span>
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

export default OrganisasiForm;