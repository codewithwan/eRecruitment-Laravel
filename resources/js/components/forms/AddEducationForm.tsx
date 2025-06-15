import axios from 'axios';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import InputField from '../InputField';
import SelectField from '../SelectField';

// Configure axios defaults for Laravel
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

// Get CSRF token from meta tag
const csrf_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrf_token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;
}

interface Major {
    id: number;
    name: string;
}

interface Education {
    id?: number;
    education_level: string;
    faculty: string;
    major_id: string;
    major?: string;
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
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [majors, setMajors] = useState<Major[]>([]);
    const [isLoadingMajors, setIsLoadingMajors] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setLocalFormData(formData);
    }, [formData]);

    // Fetch majors from API
    useEffect(() => {
        const fetchMajors = async () => {
            setIsLoadingMajors(true);
            try {
                const response = await axios.get('/api/majors');
                console.log('Majors loaded:', response.data);
                setMajors(response.data);
            } catch (error) {
                console.error('Error fetching majors:', error);
                setMessage({
                    type: 'error',
                    text: 'Gagal memuat data program studi'
                });
            } finally {
                setIsLoadingMajors(false);
            }
        };

        fetchMajors();
    }, []);

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!localFormData.education_level) {
            errors.education_level = 'Jenjang pendidikan harus dipilih';
        }

        if (!localFormData.faculty?.trim()) {
            errors.faculty = 'Fakultas harus diisi';
        }

        if (!localFormData.major_id) {
            errors.major_id = 'Program studi harus dipilih';
        }

        if (!localFormData.institution_name?.trim()) {
            errors.institution_name = 'Nama institusi harus diisi';
        }

        if (!localFormData.gpa) {
            errors.gpa = 'IPK harus diisi';
        } else {
            const gpaNum = parseFloat(localFormData.gpa);
            if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4) {
                errors.gpa = 'IPK harus antara 0-4';
            }
        }

        if (!localFormData.year_in) {
            errors.year_in = 'Tahun masuk harus diisi';
        } else {
            const yearIn = parseInt(localFormData.year_in);
            const currentYear = new Date().getFullYear();
            if (isNaN(yearIn) || yearIn < 1900 || yearIn > currentYear) {
                errors.year_in = `Tahun masuk harus antara 1900-${currentYear}`;
            }
        }

        if (localFormData.year_out) {
            const yearOut = parseInt(localFormData.year_out);
            const yearIn = parseInt(localFormData.year_in);
            const currentYear = new Date().getFullYear();
            
            if (isNaN(yearOut) || yearOut < 1900 || yearOut > currentYear + 10) {
                errors.year_out = `Tahun lulus harus antara 1900-${currentYear + 10}`;
            } else if (yearIn && yearOut < yearIn) {
                errors.year_out = 'Tahun lulus tidak boleh lebih kecil dari tahun masuk';
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
        
        onChange(e);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);

        // Validate form
        if (!validateForm()) {
            setMessage({
                type: 'error',
                text: 'Mohon periksa kembali data yang diisi'
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('📝 Form data being submitted:', localFormData);
            await onSubmit(e);

            // Langsung kembali tanpa menampilkan pesan success di sini
            // Pesan success akan ditampilkan di ListEducationForm
            onBack();

        } catch (error) {
            console.error('Error submitting form:', error);
            setMessage({
                type: 'error',
                text: 'Terjadi kesalahan saat menyimpan data'
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasExistingData = !!formData.id;

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-blue-600">
                    {hasExistingData ? 'Edit Pendidikan' : 'Tambah Pendidikan'}
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                    Lengkapi data pendidikan terakhir Anda
                </p>

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <SelectField
                            label="Jenjang Pendidikan"
                            name="education_level"
                            value={localFormData.education_level}
                            onChange={handleChange}
                            required
                            options={[
                                { value: '', label: 'Pilih Jenjang Pendidikan' },
                                 { value: 'SMA/SMK', label: 'SMA/SMK' },
                                { value: 'D3', label: 'Diploma 3 (D3)' },
                                { value: 'S1', label: 'Sarjana (S1)' },
                                { value: 'S2', label: 'Magister (S2)' },
                                { value: 'S3', label: 'Doktor (S3)' }
                            ]}
                        />
                        {validationErrors.education_level && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.education_level}</p>
                        )}
                    </div>

                    <div>
                        <InputField
                            label="Fakultas"
                            name="faculty"
                            type="text"
                            value={localFormData.faculty}
                            onChange={handleChange}
                            required
                            placeholder="Contoh: Fakultas Teknik"
                        />
                        {validationErrors.faculty && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.faculty}</p>
                        )}
                    </div>

                    <div>
                        <SelectField
                            label="Program Studi"
                            name="major_id"
                            value={localFormData.major_id}
                            onChange={handleChange}
                            required
                            disabled={isLoadingMajors}
                            options={[
                                { value: '', label: isLoadingMajors ? 'Memuat...' : 'Pilih Program Studi' },
                                ...majors.map(major => ({
                                    value: major.id.toString(),
                                    label: major.name
                                }))
                            ]}
                        />
                        {validationErrors.major_id && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.major_id}</p>
                        )}
                    </div>

                    <div>
                        <InputField
                            label="Nama Institusi"
                            name="institution_name"
                            type="text"
                            value={localFormData.institution_name}
                            onChange={handleChange}
                            required
                            placeholder="Contoh: Universitas Indonesia"
                        />
                        {validationErrors.institution_name && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.institution_name}</p>
                        )}
                    </div>

                    <div>
                        <InputField
                            label="IPK/Nilai"
                            name="gpa"
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            value={localFormData.gpa}
                            onChange={handleChange}
                            required
                            placeholder="Contoh: 3.75"
                        />
                        {validationErrors.gpa && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.gpa}</p>
                        )}
                    </div>

                    <div>
                        <InputField
                            label="Tahun Masuk"
                            name="year_in"
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={localFormData.year_in}
                            onChange={handleChange}
                            required
                            placeholder="Contoh: 2020"
                        />
                        {validationErrors.year_in && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.year_in}</p>
                        )}
                    </div>

                    <div>
                        <InputField
                            label="Tahun Lulus"
                            name="year_out"
                            type="number"
                            min="1900"
                            max={new Date().getFullYear() + 10}
                            value={localFormData.year_out}
                            onChange={handleChange}
                            placeholder="Contoh: 2024 (kosongkan jika belum lulus)"
                        />
                        {validationErrors.year_out && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.year_out}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 sm:flex-none px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-colors"
                        disabled={isSubmitting}
                    >
                        Kembali
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoadingMajors || Object.keys(validationErrors).length > 0}
                        className="flex-1 sm:flex-auto px-6 py-3 text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Menyimpan...
                            </span>
                        ) : (
                            hasExistingData ? 'Perbarui Data' : 'Simpan Data'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TambahPendidikanForm;
