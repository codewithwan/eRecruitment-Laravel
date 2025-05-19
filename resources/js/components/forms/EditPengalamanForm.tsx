import React, { ChangeEvent, FormEvent, useState } from 'react';
import InputField from '../InputField';
import SelectField from '../SelectField';
import axios from 'axios';

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

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === 'start_month' || name === 'end_month' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await axios.put(`/candidate/work-experience/${formData.id}`, formData);

            setSuccessMessage('Data berhasil diperbarui!');
            setTimeout(() => {
                setSuccessMessage(null);
                onUpdate(response.data.data); // Kirim data yang diperbarui ke PengalamanKerjaForm
            }, 2000);
        } catch (error: any) {
            console.error('Error updating experience:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {successMessage && (
                <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
                    {successMessage}
                </div>
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
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-32"
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