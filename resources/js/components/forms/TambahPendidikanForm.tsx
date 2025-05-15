import React, { useState } from 'react';
import { ChangeEvent, FormEvent } from 'react';
import InputField from '../InputField';
import SelectField from '../SelectField';

interface TambahPendidikanFormProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onBack: () => void;
}

interface PendidikanFormData {
    tingkatPendidikan: string;
    fakultas?: string;
    programStudi?: string;
    namaInstitusi: string;
    ipk: string;
    tahunMasuk: string;
    tahunKeluar: string;
}

const TambahPendidikanForm: React.FC<TambahPendidikanFormProps> = ({
    onSubmit,
    onChange,
    onBack
}) => {
    const [formData, setFormData] = useState<PendidikanFormData>({
        tingkatPendidikan: '',
        namaInstitusi: '',
        ipk: '',
        tahunMasuk: '',
        tahunKeluar: ''
    });
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        onChange(e); // Pass the event to parent's onChange
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-600">Pendidikan</h2>
                </div>
                <p className="text-sm text-gray-600 mt-2">Lengkapi pendidikan dari pendidikan terakhir</p>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-6">
                <SelectField
                    label="Pendidikan"
                    name="tingkatPendidikan"
                    value={formData.tingkatPendidikan}
                    onChange={handleChange}
                    options={["SD", "SMP", "SMA/SMK", "D3", "S1", "S2", "S3"]}
                />

                {!showAdditionalFields && (
                    <button
                        type="button"
                        onClick={() => setShowAdditionalFields(true)}
                        className="text-blue-600 flex items-center space-x-2 hover:text-blue-700"
                    >
                        <span>+ Tambah Pendidikan</span>
                    </button>
                )}

                {showAdditionalFields && (
                    <>
                        <SelectField
                            label="Fakultas"
                            name="fakultas"
                            value={formData.fakultas || ''}
                            onChange={handleChange}
                            options={["Pilih fakultas"]}
                        />

                        <SelectField
                            label="Program Studi"
                            name="programStudi"
                            value={formData.programStudi || ''}
                            onChange={handleChange}
                            options={["Pilih program studi"]}
                        />

                        <InputField
                            label="Nama Institusi"
                            name="namaInstitusi"
                            value={formData.namaInstitusi}
                            onChange={handleChange}
                            placeholder="Masukkan nama institusi"
                        />

                        <InputField
                            label="IPK"
                            name="ipk"
                            value={formData.ipk}
                            onChange={handleChange}
                            placeholder="Masukkan IPK"
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
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

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={onBack}
                                className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
                            >
                                Kembali
                            </button>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                Save & Next
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default TambahPendidikanForm;