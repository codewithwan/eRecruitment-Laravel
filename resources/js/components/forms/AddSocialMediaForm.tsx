import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import axios from 'axios';
import SelectField from '../SelectField';
import InputField from '../InputField';

interface SocialMediaFormState {
    platform_name: string;
    url: string;
}

interface SocialMediaData {
    id: number;
    platform_name: string;
    url: string;
}

interface TambahSocialMediaFormProps {
    initialData?: SocialMediaData;
    onSuccess: () => void;
    onBack: () => void;
}

const TambahSocialMediaForm: React.FC<TambahSocialMediaFormProps> = ({
    initialData,
    onSuccess,
    onBack
}) => {
    const [formData, setFormData] = useState<SocialMediaFormState>({
        platform_name: initialData?.platform_name || '',
        url: initialData?.url || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const endpoint = initialData?.id
                ? `/candidate/social-media/${initialData.id}` // Update if editing
                : '/candidate/social-media'; // Create if adding
            const method = initialData?.id ? 'put' : 'post';

            const response = await axios[method](endpoint, formData);

            if (response.data.status === 'success') {
                setMessage({
                    type: 'success',
                    text: initialData?.id ? 'Data berhasil diperbarui!' : 'Data berhasil disimpan!'
                });

                setTimeout(() => {
                    setMessage(null); // Clear the message after 3 seconds
                    onSuccess(); // Notify parent component of success
                }, 3000);
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Notification Message */}
            {message && (
                <div
                    className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-blue-600">
                    {initialData ? 'Edit Social Media' : 'Tambah Social Media'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <SelectField
                    label="Tipe Social Media"
                    name="platform_name"
                    value={formData.platform_name}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setFormData({ ...formData, platform_name: e.target.value })
                    }
                    options={[
                        { value: '', label: 'Pilih tipe social media' },
                        { value: 'linkedin', label: 'LinkedIn' },
                        { value: 'github', label: 'GitHub' },
                        { value: 'instagram', label: 'Instagram' },
                        { value: 'twitter', label: 'Twitter' },
                        { value: 'facebook', label: 'Facebook' }
                    ]}
                />

                <InputField
                    label="Social Media Link"
                    name="url"
                    value={formData.url}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="Masukkan link social media (contoh: https://...)"
                />

                <div className="flex justify-between pt-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Kembali
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TambahSocialMediaForm;