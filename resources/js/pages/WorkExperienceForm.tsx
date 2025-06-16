import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditPengalamanKerjaForm from '../components/forms/EditExperienceForm';
import TambahPengalamanForm from '../components/forms/AddExperience';

export interface PengalamanKerja {
    id: number;
    job_title: string;
    employment_status: string;
    job_description: string;
    start_month: number;
    start_year: number;
    end_month: number | null;
    end_year: number | null;
    is_current_job: boolean;
}

// Fungsi untuk mengonversi angka bulan menjadi nama bulan
const getMonthName = (month: number): string => {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month - 1] || ''; // Pastikan angka bulan valid
};

// Add Alert component at the top
const Alert = ({ type, message }: { type: 'success' | 'error'; message: string }) => (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className={`px-4 py-3 rounded-lg shadow-lg ${
            type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-400'
                : 'bg-red-100 text-red-700 border border-red-400'
        }`}>
            <div className="flex items-center">
                {type === 'success' ? (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                )}
                <span>{message}</span>
            </div>
        </div>
    </div>
);

const PengalamanKerjaForm: React.FC = () => {
    const [workExperiences, setWorkExperiences] = useState<PengalamanKerja[]>([]);
    const [selectedExperience, setSelectedExperience] = useState<PengalamanKerja | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const fetchWorkExperiences = async () => {
            try {
                const response = await axios.get('/candidate/work-experiences');
                setWorkExperiences(response.data);
            } catch (error) {
                console.error('Error fetching work experiences:', error);
            }
        };

        fetchWorkExperiences();
    }, []);

    const handleEdit = (experience: PengalamanKerja) => {
        setSelectedExperience(experience); // Set pengalaman kerja yang akan diedit
        setIsEditing(true); // Aktifkan mode edit
    };

    const handleAdd = () => {
        setIsAdding(true); // Aktifkan mode tambah
    };

    const handleBack = () => {
        setSelectedExperience(null); // Reset pengalaman kerja yang dipilih
        setIsEditing(false); // Nonaktifkan mode edit
        setIsAdding(false); // Nonaktifkan mode tambah
    };

    const handleSave = (newExperience: PengalamanKerja) => {
        setWorkExperiences((prev) => [...prev, newExperience]); // Tambahkan pengalaman baru ke daftar
        handleBack();
    };

    const handleUpdate = (updatedExperience: PengalamanKerja) => {
        setWorkExperiences((prev) =>
            prev.map((experience) =>
                experience.id === updatedExperience.id ? updatedExperience : experience
            )
        );
        handleBack();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus pengalaman kerja ini?')) {
            return;
        }

        try {
            await axios.delete(`/candidate/work-experience/${id}`);
            setWorkExperiences((prev) => prev.filter((exp) => exp.id !== id));
            
            // Show success message
            setMessage({
                type: 'success',
                text: 'Data pengalaman kerja berhasil dihapus!'
            });

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);

        } catch (error) {
            console.error('Error deleting work experience:', error);
            setMessage({
                type: 'error',
                text: 'Gagal menghapus data pengalaman kerja'
            });
        }
    };

    if (isAdding) {
        return (
            <TambahPengalamanForm
                onBack={handleBack}
                onSubmit={handleSave}
            />
        );
    }

    if (isEditing && selectedExperience) {
        return (
            <EditPengalamanKerjaForm
                experienceData={selectedExperience}
                onBack={handleBack}
                onUpdate={handleUpdate}
            />
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {message && <Alert type={message.type} message={message.text} />}
            
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-blue-600">Pengalaman Kerja</h2>
            </div>

            <div className="p-6 space-y-6">
                {workExperiences.length > 0 ? (
                    <ul className="space-y-4">
                        {workExperiences.map((experience, index) => (
                            <li key={experience.id || `exp-${index}`} className="mb-4 p-4 border rounded-lg">
                                <h4 className="text-blue-600 font-bold">{experience.job_title}</h4>
                                <p className="text-sm text-gray-600">{experience.employment_status}</p>
                                <p className="text-sm text-gray-600">{experience.job_description}</p>
                                <br />
                                <p className="text-sm text-gray-600">
                                    <span>Tanggal : </span>
                                    <strong>{getMonthName(experience.start_month)}</strong>{' '}
                                    <strong>{experience.start_year}</strong> -{' '}
                                    <strong>
                                        {experience.is_current_job
                                            ? 'Sekarang'
                                            : `${getMonthName(experience.end_month || 0)} ${experience.end_year}`}
                                    </strong>
                                </p>
                                <div className="mt-2 space-x-4">
                                    <button
                                        onClick={() => handleEdit(experience)}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(experience.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-600">Belum ada pengalaman kerja yang ditambahkan.</p>
                )}

                <button
                    type="button"
                    onClick={handleAdd}
                    className="text-blue-600 flex items-center space-x-2 hover:text-blue-700"
                >
                    <span>+ Tambah Pengalaman Kerja</span>
                </button>
            </div>
        </div>
    );
};

export default PengalamanKerjaForm;