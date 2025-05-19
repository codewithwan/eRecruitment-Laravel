import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import InputField from '../InputField';
import SelectField from '../SelectField';

interface Education {
    id?: number;
    education_level: string;
    faculty: string;
    major: string;
    institution_name: string;
    gpa: string;
    year_in: string;
    year_out: string;
}

interface TambahPendidikanFormProps {
    formData: Education;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
    onBack: () => void;
}

const TambahPendidikanForm: React.FC<TambahPendidikanFormProps> = ({
    formData,
    onChange,
    onSubmit,
    onBack
}) => {
    const [localFormData, setLocalFormData] = useState<Education>(formData);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (formData.education_level) {
            setShowAdditionalFields(true);
        }
        setLocalFormData(formData);
    }, [formData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({
            ...prev,
            [name]: value
        }));
        onChange(e);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Data yang dikirim:', localFormData); // Tambahkan log ini
        try {
            await onSubmit(e);
            setMessage({
                type: 'success',
                text: 'Data pendidikan berhasil disimpan!'
            });

            // Scroll to top to show notification
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Auto-hide notification after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Terjadi kesalahan saat menyimpan data'
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-blue-600">Pendidikan</h2>
                <p className="text-sm text-gray-600 mt-2">Lengkapi pendidikan dari pendidikan terakhir</p>

                {message && (
                    <div
                        className={`p-4 mt-4 rounded-lg flex items-center ${message.type === 'success'
                            ? 'bg-green-100 text-green-700 border border-green-400'
                            : 'bg-red-100 text-red-700 border border-red-400'
                            }`}
                        role="alert"
                    >
                        {message.type === 'success' ? (
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                        <p>{message.text}</p>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <SelectField
                    label="Pendidikan"
                    name="education_level"
                    value={localFormData.education_level}
                    onChange={handleChange}
                    options={[
                        { value: 'SD', label: 'SD' },
                        { value: 'SMP', label: 'SMP' },
                        { value: 'SMA/SMK', label: 'SMA/SMK' },
                        { value: 'D3', label: 'D3' },
                        { value: 'S1', label: 'S1' },
                        { value: 'S2', label: 'S2' },
                        { value: 'S3', label: 'S3' }
                    ]}
                    placeholder="Pilih Pendidikan"
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
                        <InputField
                            label="Fakultas"
                            name="faculty"
                            value={localFormData.faculty}
                            onChange={handleChange}
                            placeholder="Masukkan fakultas"
                        />

                        <InputField
                            label="Program Studi"
                            name="major"
                            value={localFormData.major}
                            onChange={handleChange}
                            placeholder="Masukkan program studi"
                        />

                        <InputField
                            label="Nama Institusi"
                            name="institution_name"
                            value={localFormData.institution_name}
                            onChange={handleChange}
                            placeholder="Masukkan nama institusi"
                        />

                        <InputField
                            label="IPK"
                            name="gpa"
                            value={localFormData.gpa}
                            onChange={handleChange}
                            placeholder="Masukkan IPK"
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                        />

                        <SelectField
                            label="Tahun Masuk"
                            name="year_in"
                            value={localFormData.year_in}
                            onChange={handleChange}
                            options={Array.from(
                                { length: 50 },
                                (_, i) => ({
                                    value: (new Date().getFullYear() - i).toString(),
                                    label: (new Date().getFullYear() - i).toString()
                                })
                            )}
                            placeholder="Pilih Tahun Masuk"
                        />

                        <SelectField
                            label="Tahun Keluar"
                            name="year_out"
                            value={localFormData.year_out}
                            onChange={handleChange}
                            options={Array.from(
                                { length: 50 },
                                (_, i) => ({
                                    value: (new Date().getFullYear() - i).toString(),
                                    label: (new Date().getFullYear() - i).toString()
                                })
                            )}
                            placeholder="Pilih Tahun Keluar"
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