import React from 'react';
import { ChangeEvent, FormEvent } from 'react';

interface PendidikanFormProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onTambahPendidikan: () => void;
}

const PendidikanForm: React.FC<PendidikanFormProps> = ({
    onSubmit,
    onChange,
    onTambahPendidikan
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-600">Pendidikan</h2>
                </div>
            </div>

            <div className="p-6">
                {/* List of added education will go here */}

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