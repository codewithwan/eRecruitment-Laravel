import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Add Alert component
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

interface OrganisasiData {
    id: number;
    organization_name: string;
    position: string;
    description: string;
    is_active: boolean;
    start_month: string;
    start_year: number;
    end_month: string | null;
    end_year: number | null;
}

interface OrganisasiListFormProps {
    onAdd: () => void;
    onEdit: (organization: OrganisasiData) => void;
    refresh?: boolean;
    onRefreshComplete?: () => void;
}

const OrganisasiListForm: React.FC<OrganisasiListFormProps> = ({ onAdd, onEdit }) => {
    const [organizations, setOrganizations] = useState<OrganisasiData[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchOrganizations = async () => {
        try {
            const response = await axios.get('/candidate/organizations');
            setOrganizations(response.data);
        } catch (error) {
            console.error('Error fetching organizations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus organisasi ini?')) {
            return;
        }

        try {
            await axios.delete(`/candidate/organization/${id}`);
            
            // Update local state
            setOrganizations(organizations.filter(org => org.id !== id));
            
            // Show success message
            setMessage({
                type: 'success',
                text: 'Data organisasi berhasil dihapus!'
            });

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);

        } catch (error) {
            console.error('Error deleting organization:', error);
            setMessage({
                type: 'error',
                text: 'Gagal menghapus data organisasi'
            });
        }
    };

    const getMonthName = (month: string | null): string => {
        if (!month) return '';
        
        // Direct mapping for month names
        const monthMap: { [key: string]: string } = {
            'Januari': 'Januari',
            'Februari': 'Februari',
            'Maret': 'Maret',
            'April': 'April',
            'Mei': 'Mei',
            'Juni': 'Juni',
            'Juli': 'Juli',
            'Agustus': 'Agustus',
            'September': 'September',
            'Oktober': 'Oktober',
            'November': 'November',
            'Desember': 'Desember'
        };

        return monthMap[month] || month;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {message && <Alert type={message.type} message={message.text} />}

            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-600">Organisasi</h2>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    Daftar organisasi yang pernah atau sedang Anda ikuti
                </p>
            </div>

            <div className="p-6 space-y-6">
                {organizations.length > 0 ? (
                    <ul className="space-y-4">
                        {organizations.map((org) => (
                            <li key={org.id} className="p-4 border rounded shadow-sm">
                                <h4 className="text-blue-600 font-bold">{org.organization_name}</h4>
                                <p className="text-sm text-gray-600">{org.position}</p>
                                <p className="text-sm text-gray-600">{org.description}</p>
                                <p className="text-sm text-gray-600">
                                    {getMonthName(org.start_month)} {org.start_year} -{' '}
                                    {org.is_active 
                                        ? 'Sekarang' 
                                        : `${getMonthName(org.end_month)} ${org.end_year}`
                                    }
                                </p>
                                <div className="mt-2 space-x-4">
                                    <button
                                        onClick={() => onEdit(org)}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(org.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-600">Belum ada organisasi yang ditambahkan.</p>
                )}

                <button
                    type="button"
                    onClick={onAdd}
                    className="text-blue-600 flex items-center space-x-2 hover:text-blue-700"
                >
                    <span>+ Tambah Organisasi</span>
                </button>
            </div>
        </div>
    );
};

export default OrganisasiListForm;