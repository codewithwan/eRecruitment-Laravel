import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import InputField from '../InputField';
import SelectField from '../SelectField';
import axios from 'axios';

interface PrestasiData {
    id?: number;
    title: string;
    level: string;
    month: string;
    year: number;
    description: string;
    certificate_file?: string;
    supporting_file?: string;
}

interface TambahPrestasiFormProps {
    achievementData?: PrestasiData;
    onBack: () => void;
    onSuccess: () => void;
}

interface PrestasiFormState {
    namaKompetisi: string;
    kompetisi: string;
    bulan: string;
    tahun: string;
    deskripsi: string;
    fileSertifikat: File | null;
    filePendukung: File | null;
}

const Alert = ({ type, message }: { type: 'success' | 'error'; message: string }) => (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className={`px-4 py-3 rounded-lg shadow-lg ${
            type === 'success' 
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

const TambahPrestasiForm: React.FC<TambahPrestasiFormProps> = ({
    achievementData,
    onBack,
    onSuccess
}) => {
    const [formData, setFormData] = useState<PrestasiFormState>({
        namaKompetisi: '',
        kompetisi: '',
        bulan: '',
        tahun: '',
        deskripsi: '',
        fileSertifikat: null,
        filePendukung: null
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [existingFiles, setExistingFiles] = useState({
        certificate: '',
        supporting: ''
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
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Client-side validation
            if (!formData.namaKompetisi.trim()) {
                throw new Error('Nama kompetisi harus diisi');
            }
            if (!formData.kompetisi) {
                throw new Error('Skala kompetisi harus dipilih');
            }
            if (!formData.bulan || !formData.tahun) {
                throw new Error('Bulan dan tahun harus diisi');
            }
            if (!formData.deskripsi || formData.deskripsi.length < 10) {
                throw new Error('Deskripsi minimal 10 karakter');
            }
            if (!achievementData?.id && !formData.fileSertifikat) {
                throw new Error('File sertifikat harus diupload');
            }

            const formPayload = new FormData();
            formPayload.append('title', formData.namaKompetisi.trim());
            formPayload.append('level', formData.kompetisi);
            formPayload.append('month', formData.bulan);
            formPayload.append('year', formData.tahun);
            formPayload.append('description', formData.deskripsi.trim());

            if (formData.fileSertifikat) {
                formPayload.append('certificate_file', formData.fileSertifikat);
            }
            if (formData.filePendukung) {
                formPayload.append('supporting_file', formData.filePendukung);
            }

            // Debug: Log form data
            console.log('Sending form data:');
            for (let [key, value] of formPayload.entries()) {
                console.log(key, value);
            }

            let response;
            if (achievementData?.id) {
                // For update, use POST with _method field
                formPayload.append('_method', 'PUT');
                response = await axios.post(`/candidate/achievement/${achievementData.id}`, formPayload, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    }
                });
            } else {
                response = await axios.post('/candidate/achievement', formPayload, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    }
                });
            }

            console.log('Success response:', response.data);

            setMessage({
                type: 'success',
                text: achievementData?.id ? 'Data berhasil diperbarui!' : 'Data berhasil disimpan!'
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                onSuccess();
            }, 2000);

        } catch (error: any) {
            console.error('Full error object:', error);
            console.error('Error response:', error.response?.data);
            
            let errorMessage = 'Terjadi kesalahan saat menyimpan data';
            
            if (error.response?.status === 422) {
                // Validation errors
                const errors = error.response.data.errors;
                if (errors) {
                    const errorMessages = Object.values(errors).flat();
                    errorMessage = errorMessages.join(', ');
                } else {
                    errorMessage = error.response.data.message || 'Data tidak valid';
                }
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            setMessage({
                type: 'error',
                text: errorMessage
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (achievementData) {
            // Populate the form only when editing
            setFormData({
                namaKompetisi: achievementData.title,
                kompetisi: achievementData.level,
                bulan: achievementData.month,
                tahun: achievementData.year.toString(),
                deskripsi: achievementData.description,
                fileSertifikat: null,
                filePendukung: null
            });

            setExistingFiles({
                certificate: achievementData.certificate_file || '',
                supporting: achievementData.supporting_file || ''
            });
        } else {
            // Clear the form when adding a new achievement
            setFormData({
                namaKompetisi: '',
                kompetisi: '',
                bulan: '',
                tahun: '',
                deskripsi: '',
                fileSertifikat: null,
                filePendukung: null
            });

            setExistingFiles({
                certificate: '',
                supporting: ''
            });
        }
    }, [achievementData]);

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {message && <Alert type={message.type} message={message.text} />}
            
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-600">Prestasi</h2>
                </div>
                <p className="text-sm text-gray-600 mt-2">Apakah Anda memiliki prestasi atau pencapaian?</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <InputField
                    label="Nama Kompetisi"
                    name="namaKompetisi"
                    type="text"
                    value={formData.namaKompetisi}
                    onChange={handleChange}
                    placeholder="Masukkan nama kompetisi"
                />

                <SelectField
                    label="Skala Kompetisi"
                    name="kompetisi"
                    value={formData.kompetisi}
                    onChange={handleChange}
                    options={[
                        { value: "", label: "Pilih skala kompetisi" },
                        { value: "Internasional", label: "Internasional" },
                        { value: "Nasional", label: "Nasional" },
                        { value: "Regional", label: "Regional" },
                        { value: "Lokal", label: "Lokal" }
                    ]}
                />

                <div className="grid grid-cols-2 gap-6">
                    <SelectField
                        label="Bulan"
                        name="bulan"
                        value={formData.bulan}
                        onChange={handleChange}
                        options={[
                            { value: "", label: "Pilih Bulan" },
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
                        label="Tahun"
                        name="tahun"
                        value={formData.tahun}
                        onChange={handleChange}
                        options={Array.from(
                            { length: 50 },
                            (_, i) => ({
                                value: (new Date().getFullYear() - i).toString(),
                                label: (new Date().getFullYear() - i).toString()
                            })
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
                        placeholder="Masukkan deskripsi kompetisi min. 10 karakter"
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
                                {formData.fileSertifikat?.name ||
                                    (existingFiles.certificate ? "File sertifikat sudah ada" : "Belum ada file yang dipilih")}
                            </span>
                            {existingFiles.certificate && (
                                <a
                                    href={existingFiles.certificate}
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Lihat File
                                </a>
                            )}
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
                                {formData.filePendukung?.name ||
                                    (existingFiles.supporting ? "File pendukung sudah ada" : "Belum ada file yang dipilih")}
                            </span>
                            {existingFiles.supporting && (
                                <a
                                    href={existingFiles.supporting}
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Lihat File
                                </a>
                            )}
                        </div>
                    </div>
                </div>



                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Kembali
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TambahPrestasiForm;