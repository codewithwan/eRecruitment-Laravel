import { useEducation } from '@/hooks/useEducation';
import React, { FormEvent, useState } from 'react';
import TambahPendidikanForm from './AddEducationForm';

// Add Alert component
const Alert = ({ type, message }: { type: 'success' | 'error'; message: string }) => (
    <div
        className={`p-4 mb-4 rounded-lg flex items-center ${type === 'success'
            ? 'bg-green-100 text-green-700 border border-green-400'
            : 'bg-red-100 text-red-700 border border-red-400'
            }`}
        role="alert"
    >
        {type === 'success' ? (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                />
            </svg>
        ) : (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                />
            </svg>
        )}
        <p>{message}</p>
    </div>
);

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
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);

        try {
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData);

            await updateEducation(data as any, () => {
                // Success callback - langsung kembali ke list view dan tampilkan pesan
                setIsEditing(false);
                setMessage({
                    type: 'success',
                    text: 'Data berhasil disimpan!'
                });

                // Scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                // Auto hide after 3 seconds
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
            });

        } catch (error) {
            console.error('Error updating education:', error);
            setMessage({
                type: 'error',
                text: 'Terjadi kesalahan saat menyimpan data'
            });
            setIsEditing(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    major_id: '',
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
            {/* Notifikasi hanya ditampilkan sekali di sini */}
            {message && <Alert type={message.type} message={message.text} />}
            
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Pendidikan</h2>
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

            <div className="p-6 text-gray-900">
                {/* Hapus duplikat notifikasi dari sini */}
                {education ? (
                    <div className="mb-4 p-4 border rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Tingkat Pendidikan</p>
                                <p className="font-medium text-gray-900">{education.education_level}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Fakultas</p>
                                <p className="font-medium text-gray-900">{education.faculty}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Program Studi</p>
                                <p className="font-medium text-gray-900">{education.major}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Institusi</p>
                                <p className="font-medium text-gray-900">{education.institution_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">IPK</p>
                                <p className="font-medium text-gray-900">{education.gpa}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Tahun</p>
                                <p className="font-medium text-gray-900">{education.year_in} - {education.year_out}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 flex items-center space-x-2 hover:text-blue-700"
                    >
                        <span className="text-gray-900">+ Tambah Pendidikan</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ListPendidikanForm;