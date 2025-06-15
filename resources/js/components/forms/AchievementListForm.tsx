import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus prestasi ini?')) {
            return;
        }

        try {
            await axios.delete(`/candidate/achievement/${id}`);
            
            // Update local state to remove deleted item
            setAchievements(achievements.filter(achievement => achievement.id !== id));
            
            // Show success message
            setMessage({
                type: 'success',
                text: 'Prestasi berhasil dihapus!'
            });

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);

        } catch (error) {
            console.error('Error deleting achievement:', error);
            setMessage({
                type: 'error',
                text: 'Gagal menghapus prestasi'
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {message && <Alert type={message.type} message={message.text} />}

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
                                        <div className="mt-2 space-x-4">
                                            <button
                                                onClick={() => handleEdit(achievement)}
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(achievement.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Hapus
                                            </button>
                                        </div>
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