import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface PrestasiData {
    id: number;
    title: string;
    level: string;
    month: string;
    year: number;
    description: string;
    certificate_file?: string;
    supporting_file?: string;
}

interface PrestasiListFormProps {
    onAdd: () => void;
    onEdit: (prestasi: PrestasiData) => void;
}

const PrestasiListForm: React.FC<PrestasiListFormProps> = ({ onAdd, onEdit }) => {
    const [achievements, setAchievements] = useState<PrestasiData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('/candidate/achievements');

                if (response.data.status === 'success') {
                    setAchievements(response.data.data);
                } else {
                    throw new Error('Failed to fetch achievements');
                }
            } catch (error: any) {
                console.error('Error fetching achievements:', error);
                setError(error.response?.data?.message || 'Terjadi kesalahan saat mengambil data');
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    const handleEdit = (achievement: PrestasiData) => {
        onEdit({
            id: achievement.id,
            title: achievement.title,
            level: achievement.level,
            month: achievement.month,
            year: achievement.year,
            description: achievement.description,
            certificate_file: achievement.certificate_file,
            supporting_file: achievement.supporting_file
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-blue-600">Prestasi</h2>
                <p className="text-sm text-gray-600 mt-2">Daftar prestasi yang pernah Anda raih</p>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="text-center text-gray-600">Loading...</div>
                ) : error ? (
                    <div className="text-red-600 bg-red-50 p-4 rounded">
                        {error}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {achievements.length > 0 ? (
                            <ul className="space-y-4">
                                {achievements.map((achievement) => (
                                    <li key={achievement.id} className="p-4 border rounded shadow-sm">
                                        <h4 className="text-blue-600 font-bold">{achievement.title}</h4>
                                        <p className="text-sm text-gray-600">{achievement.level}</p>
                                        <p className="text-sm text-gray-600">
                                            {achievement.month} {achievement.year}
                                        </p>
                                        <p className="text-sm text-gray-600">{achievement.description}</p>
                                        <button
                                            onClick={() => handleEdit(achievement)}
                                            className="mt-2 text-blue-600 hover:text-blue-700 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <span>Edit</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-600">Belum ada prestasi yang ditambahkan.</p>
                        )}

                        <button
                            type="button"
                            onClick={onAdd}
                            className="text-blue-600 flex items-center space-x-2 hover:text-blue-700"
                        >
                            <span>+ Tambah Prestasi</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrestasiListForm;