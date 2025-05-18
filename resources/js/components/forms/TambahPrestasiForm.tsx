import React, { ChangeEvent, FormEvent, useState } from 'react';
import InputField from '../InputField';
import SelectField from '../SelectField';

interface TambahPrestasiFormProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onBack: () => void;
}

interface PrestasiFormState {
    namaKompetisi: string;
    kompetisi: string;
    kejuaraan: string;
    bulan: string;
    tahun: string;
    deskripsi: string;
    fileSertifikat: File | null;
    filePendukung: File | null;
}

const TambahPrestasiForm: React.FC<TambahPrestasiFormProps> = ({
    onSubmit,
    onChange,
    onBack
}) => {
    const [formData, setFormData] = useState<PrestasiFormState>({
        namaKompetisi: '',
        kompetisi: '',
        kejuaraan: '',
        bulan: '',
        tahun: '',
        deskripsi: '',
        fileSertifikat: null,
        filePendukung: null
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'file') {
            const fileInput = e.target as HTMLInputElement;
            const file = fileInput.files?.[0] || null;
            setFormData(prev => ({
                ...prev,
                [name]: file
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
                    <h2 className="text-2xl font-bold text-blue-600">Prestasi</h2>
                </div>
                <p className="text-sm text-gray-600 mt-2">Apakah Anda memiliki prestasi atau pencapaian?</p>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-6">
                <InputField
                    label="Nama Kompetisi"
                    name="namaKompetisi"
                    value={formData.namaKompetisi}
                    onChange={handleChange}
                    placeholder="Masukkan nama kompetisi"
                />

                <SelectField
                    label="Kompetisi"
                    name="kompetisi"
                    value={formData.kompetisi}
                    onChange={handleChange}
                    options={[
                        "Pilih skala kompetisi",
                        "Internasional",
                        "Nasional",
                        "Regional",
                        "Lokal"
                    ]}
                />

                <SelectField
                    label="Kejuaraan"
                    name="kejuaraan"
                    value={formData.kejuaraan}
                    onChange={handleChange}
                    options={[
                        "Pilih kejuaraan",
                        "Juara 1",
                        "Juara 2",
                        "Juara 3",
                        "Harapan 1",
                        "Harapan 2",
                        "Harapan 3"
                    ]}
                />

                <div className="grid grid-cols-2 gap-6">
                    <SelectField
                        label="Bulan"
                        name="bulan"
                        value={formData.bulan}
                        onChange={handleChange}
                        options={[
                            "MMMM",
                            "Januari", "Februari", "Maret", "April",
                            "Mei", "Juni", "Juli", "Agustus",
                            "September", "Oktober", "November", "Desember"
                        ]}
                    />
                    <SelectField
                        label="Tahun"
                        name="tahun"
                        value={formData.tahun}
                        onChange={handleChange}
                        options={Array.from(
                            { length: 50 },
                            (_, i) => (new Date().getFullYear() - i).toString()
                        )}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Deskripsi Kompetisi
                    </label>
                    <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleChange}
                        placeholder="Masukkan deskripsi kompetisi min. 100 karakter"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-32 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-gray-50"
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Sertifikat atau file pendukung</h3>
                    <p className="text-sm text-gray-600">
                        Format file yang didukung adalah tidak lebih dari 500kb dan memiliki format .pdf, .jpg, .jpeg, .doc, atau .docx
                    </p>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">File Sertifikat</label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="file"
                                name="fileSertifikat"
                                onChange={handleChange}
                                accept=".pdf,.jpg,.jpeg,.doc,.docx"
                                className="hidden"
                                id="fileSertifikat"
                            />
                            <label
                                htmlFor="fileSertifikat"
                                className="px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                            >
                                Pilih File
                            </label>
                            <span className="text-sm text-gray-500">
                                {formData.fileSertifikat?.name || "Belum ada file yang dipilih"}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">File Pendukung</label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="file"
                                name="filePendukung"
                                onChange={handleChange}
                                accept=".pdf,.jpg,.jpeg,.doc,.docx"
                                className="hidden"
                                id="filePendukung"
                            />
                            <label
                                htmlFor="filePendukung"
                                className="px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                            >
                                Pilih File
                            </label>
                            <span className="text-sm text-gray-500">
                                {formData.filePendukung?.name || "Belum ada file yang dipilih"}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                >
                    - Hapus Prestasi
                </button>

                <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700"
                >
                    + Tambah Prestasi
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

export default TambahPrestasiForm;