import { useState, ChangeEvent, FormEvent } from "react";
import { FormType } from '../types/FormTypes';
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import SidebarNav from "../components/SidebarNav";
import ProfileHeader from "../components/ProfileHeader";
import NavbarHeader from "../components/NavbarHeader";
import PendidikanForm from '../components/forms/ListPendidikanForm';
import TambahPendidikanForm from '../components/forms/TambahPendidikanForm';
import PengalamanKerjaForm from './PengalamanKerjaForm';
import TambahPengalamanForm from '../components/forms/TambahPengalamanForm';
import OrganisasiForm from '../components/forms/OrganisasiForm';
import TambahOrganisasiForm from '../components/forms/TambahOrganisasiForm';
import PrestasiForm from '../components/forms/PrestasiForm';
import TambahPrestasiForm from '../components/forms/TambahPrestasiForm';
import SocialMediaForm from '../components/forms/SocialMediaForm';
import TambahSocialMediaForm from '../components/forms/TambahSocialMediaForm';
import DataTambahanForm from '../components/forms/DataTambahanForm';
import TambahSkillsForm from '../components/forms/TambahSkillsForm';
import axios from 'axios';
import { router } from '@inertiajs/react';

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

interface PengalamanKerja {
    job_title: string;
    employment_status: string;
    job_description: string;
    start_month: number;
    start_year: number;
    end_month: number | null;
    end_year: number | null;
    is_current_job: boolean;
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
        punyaNpwp: false
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

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleBack = () => {
        setShowTambahPengalaman(false);
        setSelectedExperience(null);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);

        if (!form.village) {
            alert('Kelurahan/Desa harus diisi');
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
                    const flash = page?.props?.flash;

                    if (flash) {
                        setMessage({
                            type: flash.type,
                            text: flash.message
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
                    }
                },
                onError: (errors) => {
                    setMessage({
                        type: 'error',
                        text: 'Terjadi kesalahan saat menyimpan data'
                    });
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
        }
    };

    const renderDataTambahanForm = () => {
        switch (activeTambahanForm) {
            case 'skills':
                return (
                    <TambahSkillsForm
                        onSubmit={handleSubmit}
                        onChange={handleChange}
                        onBack={() => setActiveTambahanForm(null)}
                    />
                );
            // Add other form cases here
            default:
                return (
                    <DataTambahanForm
                        onTambahSkills={() => setActiveTambahanForm('skills')}
                        onTambahKursus={() => setActiveTambahanForm('kursus')}
                        onTambahSertifikasi={() => setActiveTambahanForm('sertifikasi')}
                        onTambahBahasa={() => setActiveTambahanForm('bahasa')}
                        onTambahEnglishCert={() => setActiveTambahanForm('englishCert')}
                    />
                );
        }
    };

    const renderActiveForm = () => {
        if (activeForm === FormType.SOCIAL_MEDIA) {
            if (showSocialMediaForm) {
                return (
                    <TambahSocialMediaForm
                        onSubmit={handleSubmit}
                        onChange={handleChange}
                        onBack={() => setShowSocialMediaForm(false)}
                    />
                );
            }
            return (
                <SocialMediaForm
                    onTambahSocialMedia={() => setShowSocialMediaForm(true)}
                />
            );
        }
        if (activeForm === FormType.PRESTASI) {
            if (hasPrestasiValue && showPrestasiForm) {
                return (
                    <TambahPrestasiForm
                        onSubmit={handleSubmit}
                        onChange={handleChange}
                        onBack={() => setShowPrestasiForm(false)}
                    />
                );
            }
            return (
                <PrestasiForm
                    onHasPrestasi={(value) => {
                        setHasPrestasiValue(value);
                        if (value) {
                            setShowPrestasiForm(true);
                        }
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
                        onSubmit={handleSubmit}
                        onChange={handleChange}
                        onBack={handleBack}
                        experienceData={selectedExperience ?? undefined}
                    />
                );
            }
            return (
                <PengalamanKerjaForm
                    onTambahPengalaman={() => setShowTambahPengalaman(true)}
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
                                        <InputField label="Nama Lengkap" name="nama" value={user.name} onChange={handleChange} />
                                        <InputField label="Email" name="email" type="email" value={user.email} onChange={handleChange} />

                                        <SelectField
                                            label="Gender"
                                            name="gender"
                                            value={form.gender}
                                            onChange={handleChange}
                                            options={["Pria", "Wanita"]}
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
            <NavbarHeader />
            {message && (
                <Alert type={message.type} message={message.text} />
            )}
            <ProfileHeader
                name={user.name}
                email={user.email}
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
        </div>
    );
};

export default DataPribadiForm;