import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

    useEffect(() => {
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

        fetchOrganizations();
    }, []);

    const getMonthName = (month: string) => {
        return month || '';
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
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
                                    {org.is_active ? 'Sekarang' : `${getMonthName(org.end_month || '')} ${org.end_year}`}
                                </p>
                                <button
                                    onClick={() => onEdit(org)}
                                    className="mt-2 text-blue-600 hover:text-blue-700"
                                >
                                    Edit
                                </button>
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