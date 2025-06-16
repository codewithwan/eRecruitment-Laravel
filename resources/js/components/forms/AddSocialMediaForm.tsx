import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import axios from 'axios';
import SelectField from '../SelectField';
import InputField from '../InputField';

// Add Alert component to match the one in SocialMediaList.tsx
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
                    text: initialData?.id ? 'Social media berhasil diperbarui!' : 'Social media berhasil ditambahkan!'
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
            {/* Notification Message - using the new Alert component */}
            {message && <Alert type={message.type} message={message.text} />}

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