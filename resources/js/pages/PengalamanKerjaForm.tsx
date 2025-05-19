import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface PengalamanKerjaFormProps {
    onTambahPengalaman: (experience?: PengalamanKerja) => void;
}

interface PengalamanKerja {
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

const getMonthName = (month: number): string => {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month - 1] || ''; // Pastikan angka bulan valid
};

const PengalamanKerjaForm: React.FC<PengalamanKerjaFormProps> = ({ onTambahPengalaman }) => {
    const [workExperiences, setWorkExperiences] = useState<PengalamanKerja[]>([]);
    const [selectedExperience, setSelectedExperience] = useState<PengalamanKerja | null>(null);

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
        setSelectedExperience(experience);
        onTambahPengalaman(experience); // Pass the experience data to parent
    };

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
                {workExperiences.length > 0 ? (
                    <div>
                        <h3 className="text-lg font-bold text-gray-700">Pengalaman Kerja Anda</h3>
                        <ul className="space-y-4 mt-4">
                            {workExperiences.map((experience) => (
                                <li key={experience.id} className="p-4 border rounded shadow-sm">
                                    <h4 className="text-blue-600 font-bold">{experience.job_title}</h4>
                                    <p className="text-sm text-gray-600">{experience.employment_status}</p>
                                    <p className="text-sm text-gray-600">{experience.job_description}</p>
                                    <p className="text-sm text-gray-600">
                                        {getMonthName(experience.start_month)} {experience.start_year} -{' '}
                                        {experience.is_current_job
                                            ? 'Sekarang'
                                            : `${getMonthName(experience.end_month || 0)} ${experience.end_year}`}
                                    </p>
                                    <button
                                        onClick={() => handleEdit(experience)}
                                        className="mt-2 text-blue-600 hover:text-blue-700"
                                    >
                                        Edit
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-sm text-gray-600">Belum ada pengalaman kerja yang ditambahkan.</p>
                )}

                <button
                    type="button"
                    onClick={() => onTambahPengalaman()}
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