import React, { ChangeEvent, FormEvent, useState } from 'react';
import SelectField from '../SelectField';
import InputField from '../InputField';

interface TambahSocialMediaFormProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onBack: () => void;
}

interface SocialMediaFormState {
    type: string;
    url: string;
}

const TambahSocialMediaForm: React.FC<TambahSocialMediaFormProps> = ({
    onSubmit,
    onChange,
    onBack
}) => {
    const [formData, setFormData] = useState<SocialMediaFormState>({
        type: '',
        url: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        onChange(e);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-600">Social Media</h2>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    Apakah Anda memiliki social media?
                </p>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-6">
                <SelectField
                    label="Tipe Social Media"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={[
                        "Pilih tipe social media",
                        "LinkedIn",
                        "GitHub",
                        "Instagram",
                        "Twitter",
                        "Facebook"
                    ]}
                />

                <InputField
                    label="Social Media Link"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="Masukkan link social media"
                />

                <button
                    type="button"
                    className="text-red-500 hover:text-red-700 text-sm"
                >
                    - Hapus Social Media
                </button>

                <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                >
                    + Tambah Social Media
                </button>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Save & Next
                </button>
            </form>
        </div>
    );
};

export default TambahSocialMediaForm;