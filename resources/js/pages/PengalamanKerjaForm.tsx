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

const PengalamanKerjaForm: React.FC = () => {
    const [workExperiences, setWorkExperiences] = useState<PengalamanKerja[]>([]);
    const [selectedExperience, setSelectedExperience] = useState<PengalamanKerja | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

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
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-blue-600">Pengalaman Kerja</h2>
            </div>

            <div className="p-6 space-y-6">
                {workExperiences.length > 0 ? (
                    <ul className="space-y-4">
                        {workExperiences.map((experience) => (
                            <li key={experience.id} className="p-4 border rounded shadow-sm">
                                <h4 className="text-blue-600 font-bold">{experience.job_title}</h4>
                                <p className="text-sm text-gray-600">{experience.employment_status}</p>
                                <p className="text-sm text-gray-600">{experience.job_description}</p>
                                <br />
                                <p className="text-sm text-gray-600"> <span>Tanggal : </span>
                                    <strong>
                                        {getMonthName(experience.start_month)}</strong> <strong>{experience.start_year} </strong> -{' '}
                                    <strong>{experience.is_current_job
                                        ? 'Sekarang'
                                        : `${getMonthName(experience.end_month || 0)} ${experience.end_year}`}</strong>
                                </p>
                                <button
                                    onClick={() => handleEdit(experience)} // Panggil fungsi handleEdit
                                    className="mt-2 text-blue-600 hover:text-blue-700"
                                >
                                    Edit
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-600">Belum ada pengalaman kerja yang ditambahkan.</p>
                )}

                <button
                    type="button"
                    onClick={handleAdd} // Panggil fungsi handleAdd
                    className="text-blue-600 flex items-center space-x-2 hover:text-blue-700"
                >
                    <span>+ Tambah Pengalaman Kerja</span>
                </button>
            </div>
        </div>
    );
};

export default PengalamanKerjaForm;