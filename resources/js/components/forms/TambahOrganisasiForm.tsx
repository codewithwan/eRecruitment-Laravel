import React, { ChangeEvent, FormEvent, useState } from 'react';
import InputField from '../InputField';
import SelectField from '../SelectField';

interface TambahOrganisasiFormProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onBack: () => void;
}

interface OrganisasiFormState {
    namaOrganisasi: string;
    posisiOrganisasi: string;
    deskripsi: string;
    isActive: boolean;
    bulanMasuk: string;
    tahunMasuk: string;
    bulanKeluar: string;
    tahunKeluar: string;
}

const TambahOrganisasiForm: React.FC<TambahOrganisasiFormProps> = ({
    onSubmit,
    onChange,
    onBack
}) => {
    const [formData, setFormData] = useState<OrganisasiFormState>({
        namaOrganisasi: '',
        posisiOrganisasi: '',
        deskripsi: '',
        isActive: false,
        bulanMasuk: '',
        tahunMasuk: '',
        bulanKeluar: '',
        tahunKeluar: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'radio') {
            const radioInput = e.target as HTMLInputElement;
            setFormData(prev => ({
                ...prev,
                isActive: radioInput.value === 'Ya'
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        onChange(e);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-600">Organisasi</h2>
                </div>
                <p className="text-sm text-gray-600 mt-2">Apakah Anda aktif dalam berorganisasi? Jika iya beritahu kami.</p>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-6">
                <InputField
                    label="Nama Organisasi"
                    name="namaOrganisasi"
                    value={formData.namaOrganisasi}
                    onChange={handleChange}
                    placeholder="Masukkan nama organisasi"
                />

                <InputField
                    label="Posisi dalam Organisasi"
                    name="posisiOrganisasi"
                    value={formData.posisiOrganisasi}
                    onChange={handleChange}
                    placeholder="Masukkan posisi dalam organisasi"
                />

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Deskripsi Organisasi
                    </label>
                    <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleChange}
                        placeholder="Masukkan deskripsi organisasi min. 100 karakter"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-32 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-gray-50"
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
                                name="isActive"
                                value="Ya"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-sm">Ya</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="isActive"
                                value="Tidak"
                                checked={!formData.isActive}
                                onChange={handleChange}
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

                <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                >
                    - Hapus Organisasi
                </button>

                <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700"
                >
                    + Tambah Organisasi
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

export default TambahOrganisasiForm;