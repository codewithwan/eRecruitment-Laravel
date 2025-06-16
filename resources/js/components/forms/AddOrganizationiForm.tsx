import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import axios from 'axios';
import InputField from '../InputField';
import SelectField from '../SelectField';

interface OrganisasiData {
    id?: number;
    organization_name: string;
    position: string;
    description: string;
    is_active: boolean;
    start_month: string;  // Tambahkan ini
    start_year: number;
    end_month: string | null;  // Tambahkan ini
    end_year: number | null;
}

interface TambahOrganisasiFormProps {
    organizationData?: OrganisasiData | null;
    onBack: () => void;
    onSuccess: () => void;
}

const Alert = ({ type, message }: { type: 'success' | 'error'; message: string }) => (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className={`px-4 py-3 rounded-lg shadow-lg ${type === 'success'
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

const TambahOrganisasiForm: React.FC<TambahOrganisasiFormProps> = ({
    organizationData,
    onBack,
    onSuccess,
}) => {
    // Inisialisasi form data kosong jika tidak ada organizationData
    const initialFormData: OrganisasiData = {
        organization_name: '',
        position: '',
        description: '',
        is_active: false,
        start_month: '',
        start_year: new Date().getFullYear(),
        end_month: null,
        end_year: null,
    };

    const [formData, setFormData] = useState<OrganisasiData>(
        organizationData || initialFormData
    );
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [existingData, setExistingData] = useState<OrganisasiData | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Handle radio button change for is_active
        if (name === 'is_active') {
            const isActive = value === 'Ya';
            setFormData(prev => ({
                ...prev,
                is_active: isActive,
                // Reset end date fields if setting to active
                ...(isActive ? { end_month: null, end_year: null } : {})
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Client-side validation
        if (!formData.organization_name.trim()) {
            setMessage({ type: 'error', text: 'Nama organisasi harus diisi' });
            setLoading(false);
            return;
        }

        if (!formData.position.trim()) {
            setMessage({ type: 'error', text: 'Posisi dalam organisasi harus diisi' });
            setLoading(false);
            return;
        }

        if (!formData.description || formData.description.length < 10) {
            setMessage({ type: 'error', text: 'Deskripsi minimal 10 karakter' });
            setLoading(false);
            return;
        }

        if (!formData.start_month) {
            setMessage({ type: 'error', text: 'Bulan masuk harus dipilih' });
            setLoading(false);
            return;
        }

        if (!formData.is_active && !formData.end_month) {
            setMessage({ type: 'error', text: 'Bulan keluar harus dipilih' });
            setLoading(false);
            return;
        }

        try {
            const submitData = {
                organization_name: formData.organization_name.trim(),
                position: formData.position.trim(),
                description: formData.description.trim(),
                is_active: formData.is_active,
                start_month: formData.start_month,  // This should be the month name
                start_year: parseInt(formData.start_year.toString()),
                end_month: !formData.is_active ? formData.end_month : null,  // This should be the month name
                end_year: !formData.is_active ? (formData.end_year ? parseInt(formData.end_year.toString()) : null) : null,
            };

            console.log('Submitting data:', submitData); // Debug log

            let response;
            if (organizationData?.id) {
                response = await axios.put(`/candidate/organization/${organizationData.id}`, submitData);
                setMessage({
                    type: 'success',
                    text: 'Data berhasil diperbarui!'
                });
            } else {
                response = await axios.post('/candidate/organization', submitData);
                setMessage({
                    type: 'success',
                    text: 'Data berhasil disimpan!'
                });
            }

            console.log('Response:', response.data); // Debug log

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            setTimeout(() => {
                setMessage(null);
                onSuccess();
            }, 3000);

        } catch (error: any) {
            console.error('Error saving organization:', error.response?.data || error);
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data';
            setMessage({
                type: 'error',
                text: errorMessage
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-600">Organisasi</h2>
                </div>
                <p className="text-sm text-gray-600 mt-2">Apakah Anda aktif dalam berorganisasi? Jika iya beritahu kami.</p>
            </div>

            {message && (
                <Alert type={message.type} message={message.text} />
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <InputField
                    label="Nama Organisasi"
                    name="organization_name"
                    value={formData.organization_name}
                    onChange={handleChange}
                    placeholder="Masukkan nama organisasi"
                />

                <InputField
                    label="Posisi dalam Organisasi"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Masukkan posisi dalam organisasi"
                />

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Deskripsi Organisasi
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Masukkan deskripsi organisasi min. 10 karakter"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-32 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Apakah saat ini Anda aktif dalam organisasi ini?
                    </label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="is_active"
                                value="Ya"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-black">Ya</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="is_active"
                                value="Tidak"
                                checked={!formData.is_active}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-black">Tidak</span>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <SelectField
                        label="Bulan Masuk"
                        name="start_month"
                        value={formData.start_month}
                        onChange={handleChange}
                        options={[
                            { value: "", label: "Pilih Bulan Masuk" },
                            { value: "Januari", label: "Januari" },
                            { value: "Februari", label: "Februari" },
                            { value: "Maret", label: "Maret" },
                            { value: "April", label: "April" },
                            { value: "Mei", label: "Mei" },
                            { value: "Juni", label: "Juni" },
                            { value: "Juli", label: "Juli" },
                            { value: "Agustus", label: "Agustus" },
                            { value: "September", label: "September" },
                            { value: "Oktober", label: "Oktober" },
                            { value: "November", label: "November" },
                            { value: "Desember", label: "Desember" }
                        ]}
                    />
                    <SelectField
                        label="Tahun Masuk"
                        name="start_year"
                        value={formData.start_year.toString()}
                        onChange={handleChange}
                        options={Array.from(
                            { length: 50 },
                            (_, i) => {
                                const year = (new Date().getFullYear() - i).toString();
                                return { value: year, label: year };
                            }
                        )}
                    />
                </div>

                {!formData.is_active && (
                    <div className="grid grid-cols-2 gap-6">
                        <SelectField
                            label="Bulan Keluar"
                            name="end_month"
                            value={formData.end_month || ''}
                            onChange={handleChange}
                            options={[
                                { value: "", label: "Pilih Bulan Keluar" },
                                { value: "Januari", label: "Januari" },
                                { value: "Februari", label: "Februari" },
                                { value: "Maret", label: "Maret" },
                                { value: "April", label: "April" },
                                { value: "Mei", label: "Mei" },
                                { value: "Juni", label: "Juni" },
                                { value: "Juli", label: "Juli" },
                                { value: "Agustus", label: "Agustus" },
                                { value: "September", label: "September" },
                                { value: "Oktober", label: "Oktober" },
                                { value: "November", label: "November" },
                                { value: "Desember", label: "Desember" }
                            ]}
                        />
                        <SelectField
                            label="Tahun Keluar"
                            name="end_year"
                            value={formData.end_year?.toString() || ''}
                            onChange={handleChange}
                            options={Array.from(
                                { length: 50 },
                                (_, i) => {
                                    const year = (new Date().getFullYear() - i).toString();
                                    return { value: year, label: year };
                                }
                            )}
                        />
                    </div>
                )}

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 sm:flex-none px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-colors"
                    >
                        Kembali
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700"
                    >
                        {loading ? 'Menyimpan...' : (existingData ? 'Update' : 'Simpan')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TambahOrganisasiForm;