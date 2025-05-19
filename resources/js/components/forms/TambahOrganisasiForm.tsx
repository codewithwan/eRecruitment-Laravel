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

const TambahOrganisasiForm: React.FC = () => {
    const [formData, setFormData] = useState<OrganisasiData>({
        organization_name: '',
        position: '',
        description: '',
        is_active: false,
        start_month: '',  // Tambahkan ini
        start_year: new Date().getFullYear(),
        end_month: null,  // Tambahkan ini
        end_year: null
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [existingData, setExistingData] = useState<OrganisasiData | null>(null);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await axios.get('/candidate/organizations');
                if (response.data.length > 0) {
                    setExistingData(response.data[0]); // Assuming one organization per user
                    setFormData(response.data[0]);
                }
            } catch (error) {
                console.error('Error fetching organizations:', error);
            }
        };

        fetchOrganizations();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'radio' ? value === 'Ya' : value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;
            if (existingData?.id) {
                // Update existing data
                response = await axios.put(`/candidate/organization/${existingData.id}`, formData);
                setSuccessMessage('Data berhasil diperbarui!');
            } else {
                // Create new data
                response = await axios.post('/candidate/organization', formData);
                setSuccessMessage('Data berhasil disimpan!');
                setExistingData(response.data.data);
            }

            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
        } catch (error) {
            console.error('Error saving organization:', error);
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

            {successMessage && (
                <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
                    {successMessage}
                </div>
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
                                name="is_active"
                                value="Ya"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-sm">Ya</span>
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
                            <span className="text-sm">Tidak</span>
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
                            { value: "", label: "MMMM" },
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

                <div className="grid grid-cols-2 gap-6">
                    <SelectField
                        label="Bulan Keluar"
                        name="end_month"
                        value={formData.end_month ? formData.end_month : ''}
                        onChange={handleChange}
                        options={[
                            { value: "", label: "MMMM" },
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
                        value={formData.end_year ? formData.end_year.toString() : ''}
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
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? 'Menyimpan...' : (existingData ? 'Update' : 'Simpan')}
                </button>
            </form>
        </div>
    );
};

export default TambahOrganisasiForm;