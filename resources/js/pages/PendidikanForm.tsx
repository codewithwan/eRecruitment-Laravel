import React from 'react';
import SelectField from '../components/SelectField';

interface PendidikanFormProps {
    onTambahPendidikan: () => void;
}

const PendidikanForm: React.FC<PendidikanFormProps> = ({ onTambahPendidikan }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-600">Pendidikan</h2>
                </div>
                <p className="text-sm text-gray-600 mt-2">Lengkapi pendidikan dari pendidikan terakhir</p>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-700">Pendidikan</h3>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white">
                        <option value="">Pilih pendidikan</option>
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                        <option value="SMA">SMA/SMK</option>
                        <option value="D3">D3</option>
                        <option value="S1">S1</option>
                        <option value="S2">S2</option>
                        <option value="S3">S3</option>
                    </select>
                </div>

                <button
                    type="button"
                    onClick={onTambahPendidikan}
                    className="text-blue-600 flex items-center space-x-2 hover:text-blue-700"
                >
                    <span>+ Tambah Pendidikan</span>
                </button>
            </div>
        </div>
    );
};

export default PendidikanForm;