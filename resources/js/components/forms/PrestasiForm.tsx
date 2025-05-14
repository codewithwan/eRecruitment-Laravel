import React from 'react';

interface PrestasiFormProps {
    onHasPrestasi: (hasPrestasi: boolean) => void;
}

const PrestasiForm: React.FC<PrestasiFormProps> = ({ onHasPrestasi }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-600">Prestasi</h2>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    Apakah Anda memiliki prestasi atau pencapaian?
                </p>
            </div>

            <div className="p-6 space-y-6">
                <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="hasPrestasi"
                            value="ya"
                            onChange={() => onHasPrestasi(true)}
                            className="mr-2"
                        />
                        <span className="text-sm text-black">Ya, saya memiliki prestasi</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="hasPrestasi"
                            value="tidak"
                            onChange={() => onHasPrestasi(false)}
                            className="mr-2"
                        />
                        <span className="text-sm text-black">Tidak</span>
                    </label>
                </div>

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

export default PrestasiForm;