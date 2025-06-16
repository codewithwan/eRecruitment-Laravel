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

interface TambahPengalamanFormProps {
    experienceData?: {
        id?: number; // Tambahkan ID untuk mendukung update
        job_title: string;
        employment_status: string;
        job_description: string;
        start_month: number;
        start_year: number;
        end_month: number | null;
        end_year: number | null;
        is_current_job: boolean;
    } | null;
    onBack: () => void;

    onSubmit: (updatedData: any) => void; // Callback untuk submit data
}

const TambahPengalamanForm: React.FC<TambahPengalamanFormProps> = ({
    onBack,
    experienceData,
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        namaPekerjaan: experienceData?.job_title || '',
        statusPekerjaan: experienceData?.employment_status || '',
        deskripsi: experienceData?.job_description || '',
        bulanMasuk: experienceData?.start_month || null,
        tahunMasuk: experienceData?.start_year?.toString() || '',
        bulanKeluar: experienceData?.end_month || null,
        tahunKeluar: experienceData?.end_year?.toString() || '',
        isCurrentJob: experienceData?.is_current_job || false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === 'bulanMasuk' || name === 'bulanKeluar' ? (value ? parseInt(value) : null) : value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.namaPekerjaan.trim()) {
            newErrors.namaPekerjaan = 'Nama pekerjaan wajib diisi.';
        }

        if (!formData.statusPekerjaan.trim()) {
            newErrors.statusPekerjaan = 'Status pekerjaan wajib dipilih.';
        }

        // Ubah validasi deskripsi pekerjaan menjadi minimal 10 karakter
        if (!formData.deskripsi.trim() || formData.deskripsi.length < 10) {
            newErrors.deskripsi = 'Deskripsi pekerjaan minimal 10 karakter.';
        }

        if (!formData.bulanMasuk) {
            newErrors.bulanMasuk = 'Bulan masuk wajib dipilih.';
        }

        if (!formData.tahunMasuk.trim()) {
            newErrors.tahunMasuk = 'Tahun masuk wajib dipilih.';
        }

        if (!formData.isCurrentJob && formData.bulanKeluar === null) {
            newErrors.bulanKeluar = 'Bulan keluar wajib dipilih jika Anda tidak sedang bekerja di tempat ini.';
        }

        if (!formData.isCurrentJob && !formData.tahunKeluar.trim()) {
            newErrors.tahunKeluar = 'Tahun keluar wajib dipilih jika Anda tidak sedang bekerja di tempat ini.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const payload = {
                job_title: formData.namaPekerjaan,
                employment_status: formData.statusPekerjaan,
                job_description: formData.deskripsi,
                start_month: formData.bulanMasuk,
                start_year: parseInt(formData.tahunMasuk),
                end_month: formData.bulanKeluar ? formData.bulanKeluar : null,
                end_year: formData.tahunKeluar ? parseInt(formData.tahunKeluar) : null,
                is_current_job: formData.isCurrentJob,
            };

            if (experienceData?.id) {
                await axios.put(`/candidate/work-experience/${experienceData.id}`, payload);
                setMessage({
                    type: 'success',
                    text: 'Data berhasil diperbarui!'
                });
            } else {
                await axios.post('/candidate/work-experience', payload);
                setMessage({
                    type: 'success',
                    text: 'Data berhasil disimpan!'
                });
            }

            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Auto hide after 3 seconds and redirect
            setTimeout(() => {
                setMessage(null);
                onSubmit(payload);
            }, 3000);
        } catch (err: any) {
            console.error('Error:', err.response?.data);
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
                <div>
                    <InputField
                        label="Nama Pekerjaan"
                        name="namaPekerjaan"
                        value={formData.namaPekerjaan}
                        onChange={handleChange}
                        placeholder="Masukkan nama pekerjaan"
                    />
                    {errors.namaPekerjaan && <p className="text-red-500 text-sm">{errors.namaPekerjaan}</p>}
                </div>

                <div>
                    <SelectField
                        label="Status Pekerjaan"
                        name="statusPekerjaan"
                        value={formData.statusPekerjaan}
                        onChange={handleChange}
                        options={[
                            { value: '', label: 'Pilih status pekerjaan' },
                            { value: 'Full Time', label: 'Full Time' },
                            { value: 'Part Time', label: 'Part Time' },
                            { value: 'Freelance', label: 'Freelance' },
                            { value: 'Kontrak', label: 'Kontrak' },
                        ]}
                    />
                    {errors.statusPekerjaan && <p className="text-red-500 text-sm">{errors.statusPekerjaan}</p>}
                </div>

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
                    {errors.deskripsi && <p className="text-red-500 text-sm">{errors.deskripsi}</p>}
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
                                checked={formData.isCurrentJob}
                                onChange={() => setFormData((prev) => ({ ...prev, isCurrentJob: true }))}
                                className="mr-2"
                            />
                            <span className="text-black">Ya</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="isCurrentJob"
                                value="tidak"
                                checked={!formData.isCurrentJob}
                                onChange={() => setFormData((prev) => ({ ...prev, isCurrentJob: false }))}
                                className="mr-2"
                            />
                            <span className="text-black">Tidak</span>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <SelectField
                            label="Bulan Masuk"
                            name="bulanMasuk"
                            value={formData.bulanMasuk?.toString() || ''} // Konversi ke string untuk ditampilkan di <select>
                            onChange={handleChange}
                            options={[
                                { value: '', label: 'Pilih Bulan' },
                                { value: 1, label: 'Januari' },
                                { value: 2, label: 'Februari' },
                                { value: 3, label: 'Maret' },
                                { value: 4, label: 'April' },
                                { value: 5, label: 'Mei' },
                                { value: 6, label: 'Juni' },
                                { value: 7, label: 'Juli' },
                                { value: 8, label: 'Agustus' },
                                { value: 9, label: 'September' },
                                { value: 10, label: 'Oktober' },
                                { value: 11, label: 'November' },
                                { value: 12, label: 'Desember' },
                            ]}
                        />
                        {errors.bulanMasuk && <p className="text-red-500 text-sm">{errors.bulanMasuk}</p>}
                    </div>
                    <div>
                        <SelectField
                            label="Tahun Masuk"
                            name="tahunMasuk"
                            value={formData.tahunMasuk}
                            onChange={handleChange}
                            options={Array.from(
                                { length: 50 },
                                (_, i) => {
                                    const year = (new Date().getFullYear() - i).toString();
                                    return { value: year, label: year };
                                }
                            )}
                        />
                        {errors.tahunMasuk && <p className="text-red-500 text-sm">{errors.tahunMasuk}</p>}
                    </div>
                </div>

                {!formData.isCurrentJob && (
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <SelectField
                                label="Bulan Keluar"
                                name="bulanKeluar"
                                value={formData.bulanKeluar?.toString() || ''} // Konversi ke string untuk ditampilkan di <select>
                                onChange={handleChange}
                                options={[
                                    { value: '', label: 'Pilih Bulan' },
                                    { value: 1, label: 'Januari' },
                                    { value: 2, label: 'Februari' },
                                    { value: 3, label: 'Maret' },
                                    { value: 4, label: 'April' },
                                    { value: 5, label: 'Mei' },
                                    { value: 6, label: 'Juni' },
                                    { value: 7, label: 'Juli' },
                                    { value: 8, label: 'Agustus' },
                                    { value: 9, label: 'September' },
                                    { value: 10, label: 'Oktober' },
                                    { value: 11, label: 'November' },
                                    { value: 12, label: 'Desember' },
                                ]}
                            />
                            {errors.bulanKeluar && <p className="text-red-500 text-sm">{errors.bulanKeluar}</p>}
                        </div>
                        <div>
                            <SelectField
                                label="Tahun Keluar"
                                name="tahunKeluar"
                                value={formData.tahunKeluar}
                                onChange={handleChange}
                                options={Array.from(
                                    { length: 50 },
                                    (_, i) => {
                                        const year = (new Date().getFullYear() - i).toString();
                                        return { value: year, label: year };
                                    }
                                )}
                            />
                            {errors.tahunKeluar && <p className="text-red-500 text-sm">{errors.tahunKeluar}</p>}
                        </div>
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
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TambahPengalamanForm;