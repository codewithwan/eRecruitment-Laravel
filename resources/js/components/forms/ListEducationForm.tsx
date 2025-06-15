import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TambahPendidikanForm from './AddEducationForm';

// Configure axios defaults for Laravel
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

// Get CSRF token from meta tag
const csrf_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrf_token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;
}

interface Education {
    id: number;
    education_level: string;
    faculty: string;
    major_id: string;
    major: string;
    institution_name: string;
    gpa: string;
    year_in: string;
    year_out: string;
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

const ListEducationForm: React.FC = () => {
    const [educations, setEducations] = useState<Education[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchEducations = async () => {
        try {
            // Make sure to include the CSRF token in the headers
            const csrf_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            const response = await axios.get('/api/candidate/educations', {
                headers: {
                    'X-CSRF-TOKEN': csrf_token,
                    'Accept': 'application/json'
                }
            });

            if (response.data.success && response.data.data) {
                setEducations(response.data.data);
            } else {
                console.warn('Unexpected response format:', response.data);
                setEducations([]);
            }
        } catch (error) {
            console.error('Error fetching educations:', error);
            setMessage({
                type: 'error',
                text: 'Gagal mengambil data pendidikan'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEducations();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);

        try {
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData);

            if (editingId) {
                // Convert form data to a proper object
                const formDataObject: Record<string, string | File> = {};
                for (const [key, value] of formData.entries()) {
                    formDataObject[key] = value;
                }

                // Make sure to include the CSRF token in the headers
                await axios.put(`/api/candidate/education/${editingId}`, formDataObject, {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                setMessage({
                    type: 'success',
                    text: 'Data pendidikan berhasil diperbarui!'
                });
            } else {
                await axios.post('/api/candidate/education', data, {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                setMessage({
                    type: 'success',
                    text: 'Data pendidikan berhasil ditambahkan!'
                });
            }

            fetchEducations();
            setIsAdding(false);
            setEditingId(null);

            // Auto hide message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);

        } catch (error) {
            console.error('Error saving education:', error);
            setMessage({
                type: 'error',
                text: 'Terjadi kesalahan saat menyimpan data'
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data pendidikan ini?')) {
            return;
        }

        try {
            // Make sure to include the CSRF token in the headers
            const csrf_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            await axios.delete(`/api/candidate/education/${id}`, {
                headers: {
                    'X-CSRF-TOKEN': csrf_token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            setMessage({
                type: 'success',
                text: 'Data pendidikan berhasil dihapus!'
            });
            fetchEducations();

            // Auto hide message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        } catch (error) {
            console.error('Error deleting education:', error);
            setMessage({
                type: 'error',
                text: 'Gagal menghapus data pendidikan'
            });
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center p-4">Loading...</div>;
    }

    if (isAdding || editingId) {
        return (
            <TambahPendidikanForm
                formData={editingId
                    ? educations.find(edu => edu.id === editingId) || {
                        education_level: '',
                        faculty: '',
                        major_id: '',
                        institution_name: '',
                        gpa: '',
                        year_in: '',
                        year_out: ''
                    }
                    : {
                        education_level: '',
                        faculty: '',
                        major_id: '',
                        institution_name: '',
                        gpa: '',
                        year_in: '',
                        year_out: ''
                    }
                }
                onSubmit={handleSubmit}
                onChange={() => {}}
                onBack={() => {
                    setIsAdding(false);
                    setEditingId(null);
                }}
            />
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {message && (
                <Alert type={message.type} message={message.text} />
            )}

            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Pendidikan</h2>
                </div>
            </div>

            <div className="p-6">
                {educations.length === 0 ? (
                    <p className="text-gray-700 text-center">Belum ada data pendidikan</p>
                ) : (
                    <div className="space-y-4">
                        {educations.map((education) => (
    <div key={education.id} className="p-4 border rounded-lg bg-white">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <p className="text-blue-700 font-medium">Tingkat Pendidikan</p>
                <p className="text-gray-900">{education.education_level}</p>
            </div>
            <div>
                <p className="text-blue-700 font-medium">Fakultas</p>
                <p className="text-gray-900">{education.faculty}</p>
            </div>
            <div>
                <p className="text-blue-700 font-medium">Program Studi</p>
                <p className="text-gray-900">{education.major}</p>
            </div>
            <div>
                <p className="text-blue-700 font-medium">Institusi</p>
                <p className="text-gray-900">{education.institution_name}</p>
            </div>
            <div>
                <p className="text-blue-700 font-medium">IPK</p>
                <p className="text-gray-900">{education.gpa}</p>
            </div>
            <div>
                <p className="text-blue-700 font-medium">Tahun</p>
                <p className="text-gray-900">{education.year_in} - {education.year_out || 'Sekarang'}</p>
            </div>
        </div>
        <div className="mt-4 flex justify-start space-x-4">
            <button
                onClick={() => setEditingId(education.id)}
                className="text-blue-600 hover:text-blue-700 font-medium"
            >
                Edit
            </button>
            <button
                onClick={() => handleDelete(education.id)}
                className="text-red-600 hover:text-red-700 font-medium"
            >
                Hapus
            </button>
        </div>
    </div>
))}
                    </div>
                )}

                {/* Menambahkan margin top yang lebih besar */}
                <div className="mt-12 flex justify-start">
                    <button
                        type="button"
                        onClick={() => setIsAdding(true)}
                        className="text-blue-600 flex items-center space-x-2 hover:text-blue-700"
                    >
                        <span>+ Tambah Pendidikan</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListEducationForm;