import React, { ChangeEvent, FormEvent, useState } from 'react';
import InputField from '../InputField';
import SelectField from '../SelectField';

interface TambahPengalamanFormProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onBack: () => void;
    experienceData?: {
        job_title: string;
        employment_status: string;
        job_description: string;
        start_month: number;
        start_year: number;
        end_month: number | null;
        end_year: number | null;
        is_current_job: boolean;
    };
}

const TambahPengalamanForm: React.FC<TambahPengalamanFormProps> = ({
    onSubmit,
    onChange,
    onBack,
    experienceData,
}) => {
    const [formData, setFormData] = useState({
        namaPekerjaan: experienceData?.job_title || '',
        statusPekerjaan: experienceData?.employment_status || '',
        deskripsi: experienceData?.job_description || '',
        bulanMasuk: experienceData?.start_month?.toString() || '',
        tahunMasuk: experienceData?.start_year?.toString() || '',
        bulanKeluar: experienceData?.end_month?.toString() || '',
        tahunKeluar: experienceData?.end_year?.toString() || '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        onChange(e);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <InputField
                label="Nama Pekerjaan"
                name="namaPekerjaan"
                value={formData.namaPekerjaan}
                onChange={handleChange}
                placeholder="Masukkan nama pekerjaan"
            />

            <SelectField
                label="Status Pekerjaan"
                name="statusPekerjaan"
                value={formData.statusPekerjaan}
                onChange={handleChange}
                options={["Pilih status pekerjaan", "Full Time", "Part Time", "Freelance", "Kontrak"]}
            />

            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    Deskripsi Pekerjaan
                </label>
                <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    placeholder="Masukkan deskripsi pekerjaan min. 100 karakter"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-32 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    Apakah saat ini Anda sedang bekerja di tempat ini?
                </label>
                <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="isCurrentJob"
                            value="ya"
                            checked={experienceData?.is_current_job || false}
                            onChange={() => onChange({ target: { name: 'isCurrentJob', value: 'ya' } } as any)}
                            className="mr-2"
                        />
                        <span className="text-sm">Ya</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="isCurrentJob"
                            value="tidak"
                            checked={!experienceData?.is_current_job}
                            onChange={() => onChange({ target: { name: 'isCurrentJob', value: 'tidak' } } as any)}
                            className="mr-2"
                        />
                        <span className="text-sm">Tidak</span>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <SelectField
                    label="Bulan Masuk"
                    name="bulanMasuk"
                    value={formData.bulanMasuk}
                    onChange={handleChange}
                    options={[
                        "MMMM",
                        "Januari", "Februari", "Maret", "April",
                        "Mei", "Juni", "Juli", "Agustus",
                        "September", "Oktober", "November", "Desember"
                    ]}
                />
                <SelectField
                    label="Tahun Masuk"
                    name="tahunMasuk"
                    value={formData.tahunMasuk}
                    onChange={handleChange}
                    options={Array.from(
                        { length: 50 },
                        (_, i) => (new Date().getFullYear() - i).toString()
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <SelectField
                    label="Bulan Keluar"
                    name="bulanKeluar"
                    value={formData.bulanKeluar}
                    onChange={handleChange}
                    options={[
                        "MMMM",
                        "Januari", "Februari", "Maret", "April",
                        "Mei", "Juni", "Juli", "Agustus",
                        "September", "Oktober", "November", "Desember"
                    ]}
                />
                <SelectField
                    label="Tahun Keluar"
                    name="tahunKeluar"
                    value={formData.tahunKeluar}
                    onChange={handleChange}
                    options={Array.from(
                        { length: 50 },
                        (_, i) => (new Date().getFullYear() - i).toString()
                    )}
                />
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="bg-gray-600 text-white px-8 py-2 rounded hover:bg-gray-700"
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700"
                >
                    Save
                </button>
            </div>
        </form>
    );
};

export default TambahPengalamanForm;