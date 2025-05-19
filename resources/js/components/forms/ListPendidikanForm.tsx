import React, { useState, FormEvent } from 'react';
import { useEducation } from '@/hooks/useEducation';
import TambahPendidikanForm from './TambahPendidikanForm';

interface ListPendidikanFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onTambahPendidikan: () => void;
}

const ListPendidikanForm: React.FC<ListPendidikanFormProps> = ({
    onSubmit,
    onChange,
    onTambahPendidikan
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const { education, loading, updateEducation } = useEducation();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            await updateEducation(data as any);
            // Success will be handled by TambahPendidikanForm
        } catch (error) {
            console.error('Error updating education:', error);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center p-4 text-gray-700">Loading...</div>;
    }

    if (isEditing) {
        return (
            <TambahPendidikanForm
                formData={education || {
                    education_level: '',
                    faculty: '',
                    major: '',
                    institution_name: '',
                    gpa: '',
                    year_in: '',
                    year_out: ''
                }}
                onChange={onChange}
                onSubmit={handleSubmit}
                onBack={() => setIsEditing(false)}
            />
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Pendidikan</h2>
                    {education && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="text-blue-600 hover:text-blue-700"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>

            <div className="p-6 text-gray-800">
                {education ? (
                    <div className="mb-4 p-4 border rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Tingkat Pendidikan</p>
                                <p className="font-medium text-gray-800">{education.education_level}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Fakultas</p>
                                <p className="font-medium text-gray-800">{education.faculty}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Program Studi</p>
                                <p className="font-medium text-gray-800">{education.major}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Institusi</p>
                                <p className="font-medium text-gray-800">{education.institution_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">IPK</p>
                                <p className="font-medium text-gray-800">{education.gpa}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Tahun</p>
                                <p className="font-medium text-gray-800">{education.year_in} - {education.year_out}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 flex items-center space-x-2 hover:text-blue-700"
                    >
                        <span>+ Tambah Pendidikan</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ListPendidikanForm;