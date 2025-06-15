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

interface SocialMediaData {
    id: number;
    platform_name: string;
    url: string;
}

interface SocialMediaListProps {
    onAdd: () => void;
    onEdit: (data: SocialMediaData) => void;
    onSuccess?: (message: string) => void;
}

const SocialMediaList: React.FC<SocialMediaListProps> = ({ onAdd, onEdit, onSuccess }) => {
    const [socialMedias, setSocialMedias] = useState<SocialMediaData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Show notification helper
    const showNotification = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const fetchSocialMedias = async () => {
        try {
            const response = await axios.get('/candidate/social-media');
            if (response.data.status === 'success') {
                setSocialMedias(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching social media:', error);
            setError('Gagal memuat data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSocialMedias();
    }, []);

    const handleAdd = () => {
        onAdd();
    };

    const handleEdit = (data: SocialMediaData) => {
        onEdit(data);
    };

    const refreshList = async () => {
        try {
            const response = await axios.get('/candidate/social-media');
            if (response.data.status === 'success') {
                setSocialMedias(response.data.data);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error refreshing social media:', error);
            showNotification('error', 'Gagal memperbarui data');
        }
    };

    useEffect(() => {
        refreshList();
    }, []);

    const handleSuccess = (message: string) => {
        showNotification('success', message);
        refreshList();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus social media ini?')) {
            return;
        }

        try {
            await axios.delete(`/candidate/social-media/${id}`);
            setSocialMedias(prev => prev.filter(item => item.id !== id));
            showNotification('success', 'Social media berhasil dihapus!');
            await refreshList();
        } catch (error) {
            console.error('Error deleting social media:', error);
            showNotification('error', 'Gagal menghapus social media');
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {message && <Alert type={message.type} message={message.text} />}
            
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-blue-600">Social Media</h2>
                <p className="text-sm text-gray-600 mt-2">Daftar social media yang Anda miliki</p>
            </div>

            <div className="p-6">
                {socialMedias.length > 0 ? (
                    <div className="space-y-4">
                        {socialMedias.map((item) => (
                            <div key={item.id} className="p-4 border rounded-lg">
                                <div className="flex flex-col space-y-2">
                                    <div>
                                        <h3 className="text-gray-900 font-medium capitalize mb-1">{item.platform_name}</h3>
                                        <a href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            {item.url}
                                        </a>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}

                <button
                    type="button"
                    onClick={onAdd}
                    className="text-blue-600 flex items-center space-x-2 hover:text-blue-700 mt-4"
                >
                    <span>+ Tambah Social Media</span>
                </button>
            </div>
        </div>
    );
};

export default SocialMediaList;