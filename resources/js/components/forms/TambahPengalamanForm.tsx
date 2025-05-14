import React, { ChangeEvent, FormEvent, useState } from 'react';
import InputField from '../InputField';
import SelectField from '../SelectField';

interface TambahPengalamanFormProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onBack: () => void;
}

interface PengalamanFormState {
    namaPekerjaan: string;
    statusPekerjaan: string;
    deskripsi: string;
    bulanMasuk: string;
    tahunMasuk: string;
    bulanKeluar: string;
    tahunKeluar: string;
}

const TambahPengalamanForm: React.FC<TambahPengalamanFormProps> = ({
    onSubmit,
    onChange,
    onBack
}) => {
    const [isCurrentJob, setIsCurrentJob] = useState(false);
    const [formData, setFormData] = useState<PengalamanFormState>({
        namaPekerjaan: '',
        statusPekerjaan: '',
        deskripsi: '',
        bulanMasuk: '',
        tahunMasuk: '',
        bulanKeluar: '',
        tahunKeluar: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        onChange(e); // Pass the event to parent component
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-600">Pengalaman Kerja</h2>
                </div>
                <p className="text-sm text-gray-600 mt-2">Lengkapi pengalaman kerja Anda dari yang paling terbaru</p>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-6">
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
                                checked={isCurrentJob}
                                onChange={() => setIsCurrentJob(true)}
                                className="mr-2"
                            />
                            <span className="text-sm">Ya</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="isCurrentJob"
                                value="tidak"
                                checked={!isCurrentJob}
                                onChange={() => setIsCurrentJob(false)}
                                className="mr-2"
                            />
                            <span className="text-sm">Tidak</span>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
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
                    </div>
                    <div>
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
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
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
                    </div>
                    <div>
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
                </div>

                <div className="text-red-500 hover:text-red-700 cursor-pointer">
                    - Hapus Pengalaman Kerja
                </div>

                <div className="flex justify-between">
                    <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700"
                    >
                        + Tambah Pengalaman Kerja
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700"
                    >
                        Save & Next
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TambahPengalamanForm;