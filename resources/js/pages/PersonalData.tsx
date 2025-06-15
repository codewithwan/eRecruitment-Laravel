import SocialMediaList from "@/components/forms/SocialMediaList";
import { router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import SidebarNav from "../components/SidebarNav";
import PrestasiListForm from '../components/forms/AchievementListForm';
import TambahPrestasiForm from '../components/forms/AddAchievement';
import TambahPengalamanForm from '../components/forms/AddExperience';
import TambahOrganisasiForm from '../components/forms/AddOrganizationiForm';
import TambahSocialMediaForm from '../components/forms/AddSocialMediaForm';
import DataTambahanForm from '../components/forms/AdditionalDataForm';
import PendidikanForm from '../components/forms/ListEducationForm';
import OrganisasiForm from '../components/forms/Organization';
import { FormType } from '../types/FormTypes';
import PengalamanKerjaForm from './WorkExperienceForm';

// Tambahkan komponen Alert
const Alert = ({ type, message }: { type: 'success' | 'error'; message: string }) => (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className={`px-4 py-3 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-100 text-green-700 border border-green-400'
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

// Custom ProfileHeader dengan upload foto profil
const CustomProfileHeader = ({ name, email }: { name: string; email: string }) => {
    const [open, setOpen] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load existing profile image
    useEffect(() => {
        const loadProfileImage = async () => {
            try {
                const response = await axios.get('/api/candidate/profile-image');
                if (response.data.success && response.data.image) {
                    setProfileImage(response.data.image); // Use the correct image URL
                }
            } catch (error) {
                console.log('No existing profile image');
            }
        };
        loadProfileImage();
    }, []);

    // Tutup dropdown jika klik di luar
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
            alert('Hanya file gambar (JPG, JPEG, PNG) yang diizinkan');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file maksimal 2MB');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('profile_image', file);

            const response = await axios.post('/api/candidate/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setProfileImage(response.data.image_url);
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50';
                successMessage.textContent = 'Foto profil berhasil diupload!';
                document.body.appendChild(successMessage);
                
                setTimeout(() => {
                    if (document.body.contains(successMessage)) {
                        document.body.removeChild(successMessage);
                    }
                }, 3000);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Gagal mengupload foto profil');
        } finally {
            setUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="mx-6 py-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Profile Image Upload */}
                    <div className="relative">
                        <div 
                            className="w-16 h-16 rounded-full overflow-hidden cursor-pointer group relative"
                            onClick={triggerFileInput}
                        >
                            {profileImage ? (
                                <img 
                                    src={profileImage} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover transition-opacity group-hover:opacity-75"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center transition-colors group-hover:bg-gray-300">
                                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                            
                            {/* Overlay with plus icon */}
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                {uploading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        
                    
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                    
                    {/* Info User */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                        <p className="text-gray-600">{email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {profileImage ? 'Klik foto untuk mengganti' : 'Klik untuk upload foto profil'}
                        </p>
                    </div>
                </div>
                
                {/* Dropdown Menu */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="w-12 h-12 flex items-center justify-center bg-white border-2 border-dashed border-gray-400 rounded-lg focus:outline-none hover:border-blue-600 transition-colors"
                        aria-label="Menu"
                    >
                        <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24">
                            <circle cx="6" cy="12" r="2" fill="currentColor" />
                            <circle cx="12" cy="12" r="2" fill="currentColor" />
                            <circle cx="18" cy="12" r="2" fill="currentColor" />
                        </svg>
                    </button>
                    {open && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-dashed border-gray-400 rounded shadow-lg z-50">
                            <button
                                onClick={() => router.visit('/dashboard')}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                            >
                                Dasbor
                            </button>
                            <button
                                onClick={() => router.visit('/profile')}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                            >
                                Profil
                            </button>
                            <button
                                onClick={() => router.visit('/candidate/jobs')}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                            >
                                Lowongan Pekerjaan
                            </button>
                            <button
                                onClick={() => router.visit('/candidate/application-history')}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                            >
                                Lamaran
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface PengalamanKerja {
    id?: number;
    job_title: string;
    employment_status: string;
    job_description: string;
    start_month: number;
    start_year: number;
    end_month: number | null;
    end_year: number | null;
    is_current_job: boolean;
}

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
    onSuccess: () => void;
    onBack: () => void;
}

interface TambahOrganisasiFormProps {
    organisasiData?: any;
    onSuccess: () => void;
    onBack: () => void;
}

interface Props {
    profile?: {
        no_ektp: string;
        gender: string;
        phone_number: string;
        npwp: string;
        about_me: string;
        place_of_birth: string;
        date_of_birth: string;
        address: string;
        province: string;
        city: string;
        district: string;
        village: string;
        rt: string;
        rw: string;
        institution?: string;
        major_id?: string;
        year_graduated?: string;
    };
    user: {
        name: string;
        email: string;
    };
}

interface CompletenessResponse {
    completeness: {
        profile: boolean;
        education: boolean;
        skills: boolean;
        work_experience: boolean;
        achievements: boolean;
        overall_complete: boolean;
    };
    has_existing_cv: boolean;
    existing_cv?: {
        id: number;
        filename: string;
        created_at: string;
        download_count: number;
    };
}

// Helper functions for gender conversion
const convertGender = (dbGender: string): string => {
    return dbGender === 'male' ? 'Pria' : dbGender === 'female' ? 'Wanita' : '';
};

const convertGenderForDb = (formGender: string): string => {
    return formGender === 'Pria' ? 'male' : formGender === 'Wanita' ? 'female' : '';
};

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

enum SubFormType {
    NONE,
    TAMBAH_PENDIDIKAN
}

// Ubah nama komponen agar konsisten
const PersonalData: React.FC<Props> = ({ profile, user }) => {
    // Ubah di bagian inisialisasi form data
    const { data, setData, post, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone_number: profile?.phone_number || '',
        address: profile?.address || '',
        no_ektp: profile?.no_ektp || '',
        // Konversi gender dari database (male/female) ke format tampilan (Pria/Wanita)
        gender: profile ? (profile.gender === 'male' ? 'Pria' : profile.gender === 'female' ? 'Wanita' : '') : '',
        npwp: profile?.npwp || '',
        about_me: profile?.about_me || '',
        place_of_birth: profile?.place_of_birth || '',
        date_of_birth: formatDate(profile?.date_of_birth),
        province: profile?.province || '',
        city: profile?.city || '',
        district: profile?.district || '',
        village: profile?.village || '',
        rt: profile?.rt || '',
        rw: profile?.rw || '',
        punyaNpwp: profile?.npwp ? false : true,
        institution: profile?.institution || '',
        major_id: profile?.major_id || '',
        year_graduated: profile?.year_graduated || '',
        cv: null as File | null,
        redirect_back: null as string | null
    });

    const [file, setFile] = useState<File | null>(null);
    const [activeForm, setActiveForm] = useState<FormType>(FormType.DATA_PRIBADI);
    const [subForm, setSubForm] = useState<SubFormType>(SubFormType.NONE);
    const [showTambahPengalaman, setShowTambahPengalaman] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<PengalamanKerja | null>(null);
    const [showOrganisasiForm, setShowOrganisasiForm] = useState(false);
    const [showPrestasiForm, setShowPrestasiForm] = useState(false);
    const [hasPrestasiValue, setHasPrestasiValue] = useState<boolean | null>(null);
    const [showSocialMediaForm, setShowSocialMediaForm] = useState(false);
    const [activeTambahanForm, setActiveTambahanForm] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [selectedPrestasi, setSelectedPrestasi] = useState<PrestasiData | null>(null);
    const [selectedSocialMedia, setSelectedSocialMedia] = useState<any>(null);
    const [completenessData, setCompletenessData] = useState<CompletenessResponse | null>(null);
    const [loadingCompleteness, setLoadingCompleteness] = useState(false);
    const [generatingCV, setGeneratingCV] = useState(false);

    const { flash } = usePage<{ flash: any }>().props;

    // Handle flash messages
    React.useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                title: 'Sukses!',
                text: flash.success,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // Redirect ke halaman sebelumnya jika ada redirect_back
                if (data.redirect_back) {
                    window.location.href = data.redirect_back;
                }
            });
        }

        if (flash?.error) {
            Swal.fire({
                title: 'Error!',
                text: flash.error,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }, [flash, completenessData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleTambahPengalaman = () => {
        setSelectedExperience(null);
        setShowTambahPengalaman(true);
    };

    const handleEditPengalaman = (experience: PengalamanKerja) => {
        setSelectedExperience(experience);
        setShowTambahPengalaman(true);
    };

    const handleBack = () => {
        setShowTambahPengalaman(false);
        setSelectedExperience(null);
    };

    const handleSubmitPengalaman = async (updatedData: PengalamanKerja) => {
        try {
            if (updatedData.id) {
                await axios.put(`/candidate/work-experience/${updatedData.id}`, updatedData);
            } else {
                await axios.post('/candidate/work-experience', updatedData);
            }
            setShowTambahPengalaman(false);
            setSelectedExperience(null);
        } catch (error) {
            console.error('Error submitting pengalaman kerja:', error);
        }
    };

    const handleSubmitPrestasi = async (formData: FormData) => {
        setMessage(null);

        try {
            const endpoint = selectedPrestasi?.id
                ? `/candidate/achievement/${selectedPrestasi.id}`
                : '/candidate/achievement';
            const method = selectedPrestasi?.id ? 'put' : 'post';

            await axios[method](endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessage({
                type: 'success',
                text: selectedPrestasi?.id ? 'Data berhasil diperbarui!' : 'Data berhasil disimpan!'
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => {
                setMessage(null);
                setShowPrestasiForm(false);
                setSelectedPrestasi(null);
            }, 2000);

        } catch (error) {
            console.error('Error saving achievement:', error);
            setMessage({
                type: 'error',
                text: 'Terjadi kesalahan saat menyimpan data'
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleEditPrestasi = (prestasi: PrestasiData) => {
        setSelectedPrestasi(prestasi);
        setShowPrestasiForm(true);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);

        try {
            // Konversi gender dari format tampilan (Pria/Wanita) ke format database (male/female)
            const dbGender = data.gender === 'Pria' ? 'male' : data.gender === 'Wanita' ? 'female' : '';

            // Prepare data for API
            const dataPribadi = {
                no_ektp: data.no_ektp,
                gender: dbGender,
                phone_number: data.phone_number,
                npwp: data.punyaNpwp ? '' : data.npwp,
                about_me: data.about_me,
                place_of_birth: data.place_of_birth,
                date_of_birth: data.date_of_birth,
                address: data.address,
                province: data.province,
                city: data.city,
                district: data.district,
                village: data.village,
                rt: data.rt,
                rw: data.rw
            };

            console.log('Sending data to server:', dataPribadi);

            // Get CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            // Use axios with CSRF token and proper headers
            const response = await axios.post('/candidate/data-pribadi', dataPribadi, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            console.log('Server response:', response.data);

            // Check if response is successful
            if (response.status === 200) {
                setMessage({
                    type: 'success',
                    text: 'Data pribadi berhasil disimpan'
                });

                // Scroll to top to show success message
                window.scrollTo({ top: 0, behavior: 'smooth' });

                setTimeout(() => setMessage(null), 3000);
            } else {
                throw new Error('Unexpected response status');
            }

        } catch (error: any) {
            console.error('Error saving data:', error);

            let errorMessage = 'Terjadi kesalahan';

            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                if (error.response.status === 422) {
                    // Validation errors
                    const validationErrors = error.response.data?.errors;
                    if (validationErrors) {
                        errorMessage = Object.values(validationErrors).flat().join(', ');
                    } else {
                        errorMessage = 'Data tidak valid';
                    }
                } else if (error.response.status === 401) {
                    errorMessage = 'Sesi telah berakhir, silakan login kembali';
                    // Redirect to login
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.request) {
                // Network error
                errorMessage = 'Tidak dapat terhubung ke server';
            }

            setMessage({
                type: 'error',
                text: errorMessage
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderDataTambahanForm = () => {
        return (
            <DataTambahanForm
                onNext={() => {
                    // Handler untuk next jika diperlukan
                    console.log('Next button clicked');
                }}
                onTambahSkills={() => {
                    console.log('Tambah skills clicked');
                }}
                onTambahKursus={() => {
                    console.log('Tambah kursus clicked');
                }}
                onTambahSertifikasi={() => {
                    console.log('Tambah sertifikasi clicked');
                }}
                onTambahBahasa={() => {
                    console.log('Tambah bahasa clicked');
                }}
                onTambahEnglishCert={() => {
                    console.log('Tambah English certification clicked');
                }}
            />
        );
    };

    const checkDataCompleteness = async () => {
        setLoadingCompleteness(true);
        try {
            const response = await axios.get('/candidate/data-completeness');
            if (response.data.success) {
                setCompletenessData(response.data.data);
            }
        } catch (error) {
            console.error('Error checking data completeness:', error);
        } finally {
            setLoadingCompleteness(false);
        }
    };

    const handleGenerateCV = async () => {
        if (!completenessData?.completeness.overall_complete) {
            setMessage({
                type: 'error',
                text: 'Data belum lengkap untuk generate CV!'
            });

            setTimeout(() => {
                setMessage(null);
            }, 5000);
            return;
        }

        setGeneratingCV(true);
        setMessage(null);

        try {
            console.log('Starting CV generation...');

            const response = await axios.get('/candidate/cv/generate');

            if (response.data.success) {
                console.log('CV generated successfully:', response.data);

                setMessage({
                    type: 'success',
                    text: `${response.data.message} File: ${response.data.data.filename}`,
                });

                setTimeout(() => {
                    setMessage(null);
                }, 5000);

                if (response.data.data.download_url) {
                    setTimeout(() => {
                        window.open(response.data.data.download_url, '_blank');
                    }, 1000);
                }

                setTimeout(() => {
                    checkDataCompleteness();
                }, 2000);
            }

        } catch (error: any) {
            console.error('Error generating CV:', error);

            let errorMessage = 'Gagal generate CV';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            setMessage({
                type: 'error',
                text: errorMessage
            });

            setTimeout(() => {
                setMessage(null);
            }, 5000);
        } finally {
            setGeneratingCV(false);
        }
    };

    useEffect(() => {
        checkDataCompleteness();
    }, []);

    const renderActiveForm = () => {
        if (activeForm === FormType.SOCIAL_MEDIA) {
            if (showSocialMediaForm) {
                return (
                    <TambahSocialMediaForm
                        initialData={selectedSocialMedia}
                        onSuccess={() => {
                            setShowSocialMediaForm(false);
                            setSelectedSocialMedia(null);
                        }}
                        onBack={() => {
                            setShowSocialMediaForm(false);
                            setSelectedSocialMedia(null);
                        }}
                    />
                );
            }
            return (
                <SocialMediaList
                    onAdd={() => {
                        setSelectedSocialMedia(null);
                        setShowSocialMediaForm(true);
                    }}
                    onEdit={(data) => {
                        setSelectedSocialMedia(data);
                        setShowSocialMediaForm(true);
                    }}
                />
            );
        }
        if (activeForm === FormType.PRESTASI) {
            if (showPrestasiForm) {
                return (
                    <TambahPrestasiForm
                        achievementData={selectedPrestasi ?? undefined}
                        onSuccess={() => {
                            setShowPrestasiForm(false);
                            setSelectedPrestasi(null);
                        }}
                        onBack={() => {
                            setShowPrestasiForm(false);
                            setSelectedPrestasi(null);
                        }}
                    />
                );
            }
            return (
                <PrestasiListForm
                    onAdd={() => {
                        setSelectedPrestasi(null);
                        setShowPrestasiForm(true);
                    }}
                    onEdit={(data) => {
                        setSelectedPrestasi(data);
                        setShowPrestasiForm(true);
                    }}
                />
            );
        }
        if (activeForm === FormType.ORGANISASI) {
            if (showOrganisasiForm) {
                return (
                    <TambahOrganisasiForm
                        onSuccess={() => setShowOrganisasiForm(false)}
                        onBack={() => setShowOrganisasiForm(false)}
                    />
                );
            }
            return (
                <OrganisasiForm
                    // @ts-ignore - Add proper interface for OrganisasiForm props in the actual component
                    onTambahOrganisasi={() => setShowOrganisasiForm(true)}
                />
            );
        }
        if (activeForm === FormType.PENGALAMAN) {
            if (showTambahPengalaman) {
                return (
                    <TambahPengalamanForm
                        onSubmit={handleSubmitPengalaman}
                        onBack={handleBack}
                        experienceData={selectedExperience ?? undefined}
                    />
                );
            }
            return (
                <PengalamanKerjaForm />
            );
        }
        if (activeForm === FormType.PENDIDIKAN) {
            return (
                <PendidikanForm />
            );
        }
        if (activeForm === FormType.DATA_TAMBAHAN) {
            return renderDataTambahanForm();
        }

        // Default case - DATA_PRIBADI
        return (
            <div className="bg-white rounded-lg shadow-sm text-black">
                <div className="p-6 border-b">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6 text-black">
                            <div>
                                    <InputField label="No. E-KTP" name="no_ektp" value={data.no_ektp} onChange={handleChange} />
                                <InputField label="Nama Lengkap" name="name" value={data.name} onChange={handleChange} />
                                <InputField label="Email" name="email" type="email" value={data.email} onChange={handleChange} />

                                <SelectField
                                    label="Gender"
                                    name="gender"
                                    value={data.gender}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'Pria', label: 'Pria' },
                                        { value: 'Wanita', label: 'Wanita' }
                                    ]}
                                />
                            </div>
                            <div>
                                <InputField
                                    label="No. Telepon"
                                    name="phone_number"
                                    value={data.phone_number}
                                    onChange={handleChange}
                                />
                                <div className="space-y-2">
                                    <InputField
                                        label="NPWP"
                                        name="npwp"
                                        value={data.npwp}
                                        onChange={handleChange}
                                        disabled={data.punyaNpwp}
                                    />
                                    <label className="inline-flex items-center text-sm text-gray-600">
                                        <input
                                            type="checkbox"
                                            name="punyaNpwp"
                                            checked={data.punyaNpwp}
                                            onChange={(e) => {
                                                handleChange(e);
                                                if (e.target.checked) {
                                                    setData(prev => ({
                                                        ...prev,
                                                        npwp: ''
                                                    }));
                                                }
                                            }}
                                            className="mr-2"
                                        />
                                        Saya tidak mempunyai NPWP
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Tentang Saya</label>
                            <textarea
                                name="about_me"
                                value={data.about_me}
                                onChange={handleChange}
                                placeholder="Ceritakan tentang Anda min. 200 karakter"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-24
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                            />
                        </div>

                        <h3 className="font-semibold border-b pb-2">Kelahiran</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <InputField label="Tempat Lahir" name="place_of_birth" value={data.place_of_birth} onChange={handleChange} />
                            <InputField label="Tanggal Lahir" name="date_of_birth" type="date" value={data.date_of_birth} onChange={handleChange} />
                        </div>

                        <h3 className="font-semibold border-b pb-2">Alamat</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <InputField label="Alamat" name="address" value={data.address} onChange={handleChange} />
                                <InputField label="Provinsi" name="province" value={data.province} onChange={handleChange} />
                                <InputField label="Kecamatan" name="district" value={data.district} onChange={handleChange} />
                                <InputField label="Kelurahan/Desa" name="village" value={data.village} onChange={handleChange} />
                            </div>
                            <div>
                                <InputField label="Kota/Kabupaten" name="city" value={data.city} onChange={handleChange} />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="RT" name="rt" value={data.rt} onChange={handleChange} />
                                    <InputField label="RW" name="rw" value={data.rw} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '30px' }}>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                {processing ? 'Memproses...' : 'Simpan Data'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white">
            {message && (
                <Alert type={message.type} message={message.text} />
            )}

            <CustomProfileHeader
                name={data.name}
                email={data.email}
            />

            <div className="mx-6 flex space-x-6">
                <div className="w-64 bg-white rounded-lg">
                    <SidebarNav
                        activeForm={activeForm}
                        onFormChange={setActiveForm}
                    />
                </div>

                <div className="flex-1">
                    {renderActiveForm()}
                </div>
            </div>

            {/* CV Generation Section */}
            <div className="mx-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Generate CV Otomatis</h3>
                            <p className="text-gray-600 mt-1">
                                Buat CV professional dari data yang sudah Anda isi
                            </p>
                        </div>
                        <button
                            onClick={checkDataCompleteness}
                            disabled={loadingCompleteness}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            {loadingCompleteness ? 'Checking...' : 'Refresh Status'}
                        </button>
                    </div>

                    {completenessData && (
                        <>
                            {/* Data Completeness Status */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                <div className={`p-3 rounded-lg ${completenessData.completeness.profile ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${completenessData.completeness.profile ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className="text-sm font-medium">Data Pribadi</span>
                                    </div>
                                </div>

                                <div className={`p-3 rounded-lg ${completenessData.completeness.education ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${completenessData.completeness.education ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className="text-sm font-medium">Pendidikan</span>
                                    </div>
                                </div>

                                <div className={`p-3 rounded-lg ${completenessData.completeness.skills ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${completenessData.completeness.skills ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className="text-sm font-medium">Skills/Kemampuan</span>
                                    </div>
                                </div>

                                <div className={`p-3 rounded-lg ${completenessData.completeness.work_experience ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${completenessData.completeness.work_experience ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        <span className="text-sm font-medium">Pengalaman Kerja</span>
                                    </div>
                                    <span className="text-xs">(Opsional)</span>
                                </div>

                                <div className={`p-3 rounded-lg ${completenessData.completeness.achievements ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${completenessData.completeness.achievements ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        <span className="text-sm font-medium">Prestasi</span>
                                    </div>
                                    <span className="text-xs">(Opsional)</span>
                                </div>
                            </div>

                            {/* Existing CV Info */}
                            {completenessData.has_existing_cv && completenessData.existing_cv && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-blue-900">CV Tersimpan</h4>
                                            <p className="text-blue-700 text-sm">
                                                {completenessData.existing_cv.filename}
                                            </p>
                                            <p className="text-blue-600 text-xs">
                                                Dibuat: {completenessData.existing_cv.created_at} |
                                                Downloaded: {completenessData.existing_cv.download_count}x
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Generate CV Button */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleGenerateCV}
                                    disabled={!completenessData.completeness.overall_complete || generatingCV}
                                    className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                                        completenessData.completeness.overall_complete && !generatingCV
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {generatingCV ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Generating CV...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Generate & Download CV
                                        </>
                                    )}
                                </button>

                                {!completenessData.completeness.overall_complete && (
                                    <div className="text-red-600 text-sm flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Lengkapi data yang diperlukan untuk generate CV
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonalData;
