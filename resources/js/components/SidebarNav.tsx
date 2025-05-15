import React from 'react';
import { FormType } from '../types/FormTypes';

interface SidebarNavProps {
    activeForm: FormType;
    onFormChange: (formType: FormType) => void;
}

const navItems = [
    { label: 'Data Pribadi', type: FormType.DATA_PRIBADI },
    { label: 'Pendidikan', type: FormType.PENDIDIKAN },
    { label: 'Pengalaman Kerja', type: FormType.PENGALAMAN },
    { label: 'Organisasi', type: FormType.ORGANISASI },
    { label: 'Prestasi', type: FormType.PRESTASI },
    { label: 'Social Media', type: FormType.SOCIAL_MEDIA },
    { label: 'Data Tambahan', type: FormType.DATA_TAMBAHAN },
];

const SidebarNav: React.FC<SidebarNavProps> = ({ activeForm, onFormChange }) => {
    return (
        <div className="w-64 bg-white p-4">
            {navItems.map((item) => (
                <button
                    key={item.type}
                    onClick={() => onFormChange(item.type)}
                    className={`w-full text-left py-2 px-4 rounded transition-colors ${activeForm === item.type
                        ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-blue-50'
                        }`}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default SidebarNav;