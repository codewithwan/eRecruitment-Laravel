import React, { useState } from 'react';
import TambahPengalamanForm from '../components/forms/TambahPengalamanForm';

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

const CandidateProfile: React.FC = () => {
    const [showAddExperience, setShowAddExperience] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<PengalamanKerja | null>(null);

    const handleBack = () => {
        setShowAddExperience(false);
        setSelectedExperience(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        console.log('Form changed:', e.target.name, e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {showAddExperience ? (
                <TambahPengalamanForm
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                    onBack={handleBack}
                    experienceData={selectedExperience ?? undefined}
                />
            ) : (
                <button
                    onClick={() => setShowAddExperience(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Tambah Pengalaman
                </button>
            )}
        </div>
    );
};

export default CandidateProfile;