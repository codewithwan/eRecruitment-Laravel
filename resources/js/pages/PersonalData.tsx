import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FormType } from '../types/FormTypes';
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import SidebarNav from "../components/SidebarNav";
import ProfileHeader from "../components/ProfileHeader";
import PendidikanForm from '../components/forms/ListEducationForm';
import TambahPendidikanForm from '../components/forms/AddEducationForm';
import PengalamanKerjaForm from './WorkExperienceForm';
import TambahPengalamanForm from '../components/forms/AddExperience';
import OrganisasiForm from '../components/forms/Organization';
import TambahOrganisasiForm from '../components/forms/AddOrganizationiForm';
import PrestasiForm from '../components/forms/Achievement';
import TambahPrestasiForm from '../components/forms/AddAchievement';
import SocialMediaForm from '../components/forms/SocialMediaForm';
import TambahSocialMediaForm from '../components/forms/AddSocialMediaForm';
import DataTambahanForm from '../components/forms/AdditionalDataForm';
import axios from 'axios';
import { router } from '@inertiajs/react';
import PrestasiListForm from '../components/forms/AchievementListForm';
import SocialMediaList from "@/components/forms/SocialMediaList";

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

// Custom ProfileHeader dengan icon profile biru
const CustomProfileHeader = ({ name, email }: { name: string; email: string }) => (
    <div className="bg-white border-b border-gray-200">
        <div className="mx-6 py-6">
            <div className="flex items-center space-x-4">
                {/* Icon Profile Biru */}
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </div>
                
                {/* Info User */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                    <p className="text-gray-600">{email}</p>
                    {/* Hilangkan badge "Candidate User" yang redundan */}
                </div>
            </div>
        </div>
    </div>
);

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

// Add this with other interfaces
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
    onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
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
    };
    user: {
        name: string;
        email: string;
    };
}

// Tambahkan interface untuk data completeness
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

const DataPribadiForm: React.FC<Props> = ({ profile, user }) => {
    const [form, setForm] = useState({
        no_ektp: profile?.no_ektp || '',
        gender: profile?.gender ? convertGender(profile.gender) : '',
        phone_number: profile?.phone_number || '',
        npwp: profile?.npwp || '',
        about_me: profile?.about_me || '',
        place_of_birth: profile?.place_of_birth || '',
        date_of_birth: formatDate(profile?.date_of_birth) || '',
        address: profile?.address || '',
        province: profile?.province || '',
        city: profile?.city || '',
        district: profile?.district || '',
        village: profile?.village || '',
        rt: profile?.rt || '',
        rw: profile?.rw || '',
        punyaNpwp: false,
        // Tambahkan nama dan email ke form state
        name: user.name || '',
        email: user.email || ''
    });

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

    // Tambahkan import dan state
    const [completenessData, setCompletenessData] = useState<CompletenessResponse | null>(null);
    const [loadingCompleteness, setLoadingCompleteness] = useState(false);
    const [generatingCV, setGeneratingCV] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleTambahPengalaman = () => {
        setSelectedExperience(null); // Reset pengalaman kerja yang dipilih
        setShowTambahPengalaman(true);
    };

    const handleEditPengalaman = (experience: PengalamanKerja) => {
        setSelectedExperience(experience); // Set pengalaman kerja yang akan diedit
        setShowTambahPengalaman(true);
    };

    const handleBack = () => {
        setShowTambahPengalaman(false);
        setSelectedExperience(null);
    };

    const handleSubmitPengalaman = async (updatedData: PengalamanKerja) => {
        try {
            if (updatedData.id) {
                // Update pengalaman kerja
                await axios.put(`/candidate/work-experience/${updatedData.id}`, updatedData);
            } else {
                // Tambah pengalaman kerja baru
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

        if (!form.village) {
            setMessage({
                type: 'error',
                text: 'Kelurahan/Desa harus diisi'
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            const submitData = {
                ...form,
                gender: convertGenderForDb(form.gender),
                date_of_birth: formatDate(form.date_of_birth),
                npwp: form.punyaNpwp ? null : form.npwp
            };

            await router.post('/candidate/profile/data-pribadi', submitData, {
                onSuccess: (page: any) => {
                    setMessage({
                        type: 'success',
                        text: 'Data berhasil disimpan!'
                    });

                    // Scroll to top
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });

                    // Auto hide after 3 seconds
                    setTimeout(() => {
                        setMessage(null);
                    }, 3000);
                },
                onError: (errors) => {
                    setMessage({
                        type: 'error',
                        text: 'Terjadi kesalahan saat menyimpan data'
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
                preserveScroll: true,
                preserveState: true
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setMessage({
                type: 'error',
                text: 'Terjadi kesalahan saat menyimpan data'
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

    // Function untuk generate CV dengan notifikasi hilang otomatis dalam 5 detik
    const handleGenerateCV = async () => {
        if (!completenessData?.completeness.overall_complete) {
            setMessage({
                type: 'error',
                text: 'Data belum lengkap untuk generate CV!'
            });
            
            // Auto hide error notification after 5 seconds
            setTimeout(() => {
                setMessage(null);
            }, 5000);
            return;
        }

        setGeneratingCV(true);
        setMessage(null);
        
        try {
            console.log('Starting CV generation...');
            
            // Update: Gunakan JSON response instead of blob
            const response = await axios.get('/candidate/cv/generate');

            if (response.data.success) {
                console.log('CV generated successfully:', response.data);
                
                setMessage({
                    type: 'success',
                    text: `${response.data.message} File: ${response.data.data.filename}`,
                });

                // Auto hide success notification after 5 seconds
                setTimeout(() => {
                    setMessage(null);
                }, 5000);

                // Auto download CV if URL available
                if (response.data.data.download_url) {
                    setTimeout(() => {
                        window.open(response.data.data.download_url, '_blank');
                    }, 1000);
                }

                // Refresh data completeness untuk update info CV
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

            // Auto hide error notification after 5 seconds
            setTimeout(() => {
                setMessage(null);
            }, 5000);
        } finally {
            setGeneratingCV(false);
        }
    };

    // useEffect untuk load data completeness saat component mount
    useEffect(() => {
        checkDataCompleteness();
    }, []);

    const renderActiveForm = () => {
        if (activeForm === FormType.SOCIAL_MEDIA) {
            if (showSocialMediaForm) {
                return (
                    <TambahSocialMediaForm
                        initialData={selectedSocialMedia} // Pass data only when editing
                        onSuccess={() => {
                            setShowSocialMediaForm(false); // Hide the form after success
                            setSelectedSocialMedia(null); // Clear selected social media
                        }}
                        onBack={() => {
                            setShowSocialMediaForm(false); // Hide the form when going back
                            setSelectedSocialMedia(null); // Clear selected social media
                        }}
                    />
                );
            }
            return (
                <SocialMediaList
                    onAdd={() => {
                        setSelectedSocialMedia(null); // Ensure no data is pre-filled
                        setShowSocialMediaForm(true); // Show the form
                    }}
                    onEdit={(data) => {
                        setSelectedSocialMedia(data); // Pass the selected data for editing
                        setShowSocialMediaForm(true); // Show the form
                    }}
                />
            );
        }
        if (activeForm === FormType.PRESTASI) {
            if (showPrestasiForm) {
                return (
                    <TambahPrestasiForm
                        achievementData={selectedPrestasi ?? undefined} // Pass only when editing
                        onSuccess={() => {
                            setShowPrestasiForm(false);
                            setSelectedPrestasi(null); // Clear selectedPrestasi after success
                        }}
                        onBack={() => {
                            setShowPrestasiForm(false);
                            setSelectedPrestasi(null); // Clear selectedPrestasi when going back
                        }}
                    />
                );
            }
            return (
                <PrestasiListForm
                    onAdd={() => {
                        setSelectedPrestasi(null); // Ensure selectedPrestasi is cleared when adding
                        setShowPrestasiForm(true);
                    }}
                    onEdit={(data) => {
                        setSelectedPrestasi(data); // Set selectedPrestasi for editing
                        setShowPrestasiForm(true);
                    }}
                />
            );
        }
        if (activeForm === FormType.ORGANISASI) {
            if (showOrganisasiForm) {
                return (
                    <TambahOrganisasiForm
                        onSubmit={handleSubmit}
                        onChange={handleChange}
                        onBack={() => setShowOrganisasiForm(false)}
                    />
                );
            }
            return (
                <OrganisasiForm
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
                <PengalamanKerjaForm
                    onTambahPengalaman={handleTambahPengalaman}
                    onEditPengalaman={handleEditPengalaman}
                />
            );
        }
        if (activeForm === FormType.PENDIDIKAN) {
            return (
                <PendidikanForm
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                    onTambahPendidikan={() => { }}
                />
            );
        }
        if (activeForm === FormType.DATA_TAMBAHAN) {
            return renderDataTambahanForm();
        }
        switch (activeForm) {
            case FormType.DATA_PRIBADI:
            default:
                return (
                    <div className="bg-white rounded-lg shadow-sm text-black">
                        <div className="p-6 border-b">
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-6 text-black">
                                    <div>
                                        <InputField label="No. E-KTP" name="no_ektp" value={form.no_ektp} onChange={handleChange} />
                                        {/* Ubah dari user.name ke form.name */}
                                        <InputField label="Nama Lengkap" name="name" value={form.name} onChange={handleChange} />
                                        {/* Ubah dari user.email ke form.email */}
                                        <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />

                                        <SelectField
                                            label="Gender"
                                            name="gender"
                                            value={form.gender}
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
                                            value={form.phone_number}
                                            onChange={handleChange}
                                        />
                                        <div className="space-y-2">
                                            <InputField
                                                label="NPWP"
                                                name="npwp"
                                                value={form.npwp}
                                                onChange={handleChange}
                                                disabled={form.punyaNpwp}
                                            />
                                            <label className="inline-flex items-center text-sm text-gray-600">
                                                <input
                                                    type="checkbox"
                                                    name="punyaNpwp"
                                                    checked={form.punyaNpwp}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        if (e.target.checked) {
                                                            setForm(prev => ({
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
                                        value={form.about_me}
                                        onChange={handleChange}
                                        placeholder="Ceritakan tentang Anda min. 200 karakter"
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-24 
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                                    />
                                </div>

                                <h3 className="font-semibold border-b pb-2">Kelahiran</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <InputField label="Tempat Lahir" name="place_of_birth" value={form.place_of_birth} onChange={handleChange} />
                                    <InputField label="Tanggal Lahir" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} />
                                </div>

                                <h3 className="font-semibold border-b pb-2">Alamat</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <InputField label="Alamat" name="address" value={form.address} onChange={handleChange} />
                                        <InputField label="Provinsi" name="province" value={form.province} onChange={handleChange} />
                                        <InputField label="Kecamatan" name="district" value={form.district} onChange={handleChange} />
                                        <InputField label="Kelurahan/Desa" name="village" value={form.village} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <InputField label="Kota/Kabupaten" name="city" value={form.city} onChange={handleChange} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label="RT" name="rt" value={form.rt} onChange={handleChange} />
                                            <InputField label="RW" name="rw" value={form.rw} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                >
                                    Save & Next
                                </button>
                            </form>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hilangkan NavbarHeader */}
            {/* <NavbarHeader /> */}
            
            {message && (
                <Alert type={message.type} message={message.text} />
            )}
            
            {/* Ganti ProfileHeader dengan CustomProfileHeader - gunakan form state */}
            <CustomProfileHeader
                name={form.name}
                email={form.email}
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

export default DataPribadiForm;