import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SocialMediaData {
    id: number;
    platform_name: string;
    url: string;
}

interface SocialMediaListProps {
    onAdd: () => void;
    onEdit: (data: SocialMediaData) => void;
}

const SocialMediaList: React.FC<SocialMediaListProps> = ({ onAdd, onEdit }) => {
    const [socialMedias, setSocialMedias] = useState<SocialMediaData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSocialMedias();
    }, []); // Fetch data on mount

    useEffect(() => {
        if (!loading) {
            fetchSocialMedias(); // Refresh the list after adding/editing
        }
    }, [loading]);

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

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-blue-600">Social Media</h2>
                <p className="text-sm text-gray-600 mt-2">Daftar social media yang Anda miliki</p>
            </div>

            <div className="p-6">
                {socialMedias.length > 0 ? (
                    <div className="space-y-4">
                        {socialMedias.map((item) => (
                            <div key={item.id} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-start">
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
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        Edit
                                    </button>
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