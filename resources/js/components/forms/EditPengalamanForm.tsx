import React, { ChangeEvent, FormEvent, useState } from 'react';
import InputField from '../InputField';
import SelectField from '../SelectField';
import axios from 'axios';

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

interface PengalamanKerja {
    id: number;
    job_title: string;
    employment_status: string;
    job_description: string;
    start_month: number;
    start_year: number;
    end_month: number | null;
    end_year: number | null;
    is_current_job: boolean;
}

interface EditPengalamanKerjaFormProps {
    experienceData: PengalamanKerja;
    onBack: () => void;
    onUpdate: (updatedExperience: PengalamanKerja) => void;
}

const EditPengalamanKerjaForm: React.FC<EditPengalamanKerjaFormProps> = ({
    experienceData,
    onBack,
    onUpdate,
}) => {
    const [formData, setFormData] = useState(experienceData);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === 'start_month' || name === 'end_month' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);

        setLoading(true);

        try {
            const response = await axios.put(`/candidate/work-experience/${formData.id}`, formData);

            setMessage({
                type: 'success',
                text: 'Data berhasil diperbarui!'
            });

            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Auto hide after 3 seconds and redirect
            setTimeout(() => {
                setMessage(null);
                onUpdate(response.data.data);
            }, 3000);
        } catch (error: any) {
            console.error('Error updating experience:', error.response?.data);
            setMessage({
                type: 'error',
                text: 'Terjadi kesalahan saat menyimpan data'
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {message && (
                <Alert type={message.type} message={message.text} />
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <InputField
                    label="Nama Pekerjaan"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    placeholder="Masukkan nama pekerjaan"
                />
                <SelectField
                    label="Status Pekerjaan"
                    name="employment_status"
                    value={formData.employment_status}
                    onChange={handleChange}
                    options={[
                        { value: 'Full Time', label: 'Full Time' },
                        { value: 'Part Time', label: 'Part Time' },
                        { value: 'Freelance', label: 'Freelance' },
                        { value: 'Kontrak', label: 'Kontrak' },
                    ]}
                    placeholder="Pilih status pekerjaan"
                />
                <textarea
                    name="job_description"
                    value={formData.job_description}
                    onChange={handleChange}
                    placeholder="Masukkan deskripsi pekerjaan"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black h-32"
                />
                <div className="grid grid-cols-2 gap-6">
                    <SelectField
                        label="Bulan Masuk"
                        name="start_month"
                        value={formData.start_month}
                        onChange={handleChange}
                        options={Array.from({ length: 12 }, (_, i) => ({
                            value: i + 1,
                            label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }),
                        }))}
                        placeholder="Pilih Bulan Masuk"
                    />
                    <InputField
                        label="Tahun Masuk"
                        name="start_year"
                        value={formData.start_year.toString()}
                        onChange={handleChange}
                        placeholder="Masukkan tahun masuk"
                    />
                </div>

                {!formData.is_current_job && (
                    <div className="grid grid-cols-2 gap-6">
                        <SelectField
                            label="Bulan Keluar"
                            name="end_month"
                            value={formData.end_month || ''}
                            onChange={handleChange}
                            options={Array.from({ length: 12 }, (_, i) => ({
                                value: i + 1,
                                label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }),
                            }))}
                            placeholder="Pilih Bulan Keluar"
                        />
                        <InputField
                            label="Tahun Keluar"
                            name="end_year"
                            value={formData.end_year?.toString() || ''}
                            onChange={handleChange}
                            placeholder="Masukkan tahun keluar"
                        />
                    </div>
                )}

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        className="bg-gray-600 text-white px-8 py-2 rounded hover:bg-gray-700"
                    >
                        Kembali
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPengalamanKerjaForm;