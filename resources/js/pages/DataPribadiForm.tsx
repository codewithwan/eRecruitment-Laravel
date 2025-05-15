import { useState, ChangeEvent, FormEvent } from "react";
import { FormType } from '../types/FormTypes';
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import SidebarNav from "../components/SidebarNav";
import ProfileHeader from "../components/ProfileHeader";
import NavbarHeader from "../components/NavbarHeader";
import PendidikanForm from '../components/forms/PendidikanForm';
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

enum SubFormType {
    NONE,
    TAMBAH_PENDIDIKAN
}

interface FormData {
    nik: string;
    nama: string;
    email: string;
    gender: string;
    agama: string;
    namaIbu: string;
    noTelp: string; // Add this field
    npwp: string;
    punyaNpwp: boolean;
    tentangSaya: string;
    tempatLahir: string;
    tanggalLahir: string;
    alamat: string;
    provinsi: string;
    kota: string;
    kecamatan: string;
    kelurahan: string;
    rt: string;
    rw: string;
}

const DataPribadiForm: React.FC = () => {
    const [form, setForm] = useState<FormData>({
        nik: '',
        nama: '',
        email: '',
        gender: '',
        agama: '',
        namaIbu: '',
        noTelp: '', // Add this field
        npwp: '',
        punyaNpwp: false,
        tentangSaya: '',
        tempatLahir: '',
        tanggalLahir: '',
        alamat: '',
        provinsi: '',
        kota: '',
        kecamatan: '',
        kelurahan: '',
        rt: '',
        rw: ''
    });

    const [activeForm, setActiveForm] = useState<FormType>(FormType.DATA_PRIBADI);
    const [subForm, setSubForm] = useState<SubFormType>(SubFormType.NONE);
    const [showTambahPengalaman, setShowTambahPengalaman] = useState(false);
    const [showOrganisasiForm, setShowOrganisasiForm] = useState(false);
    const [showPrestasiForm, setShowPrestasiForm] = useState(false);
    const [hasPrestasiValue, setHasPrestasiValue] = useState<boolean | null>(null);
    const [showSocialMediaForm, setShowSocialMediaForm] = useState(false);
    const [activeTambahanForm, setActiveTambahanForm] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Data dikirim:", form);
        // Siap untuk kirim ke Laravel API nanti
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
                        onBack={() => setShowTambahPengalaman(false)}
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
            if (subForm === SubFormType.TAMBAH_PENDIDIKAN) {
                return (
                    <TambahPendidikanForm
                        onSubmit={handleSubmit}
                        onChange={handleChange}
                        onBack={() => setSubForm(SubFormType.NONE)}
                    />
                );
            }
            return (
                <PendidikanForm
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                    onTambahPendidikan={() => setSubForm(SubFormType.TAMBAH_PENDIDIKAN)}
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
                                        <InputField label="No. E-KTP" name="nik" value={form.nik} onChange={handleChange} />
                                        <InputField label="Nama Lengkap" name="nama" value={form.nama} onChange={handleChange} />
                                        <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />

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
                                            name="noTelp"
                                            value={form.noTelp}
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
                                        name="tentangSaya"
                                        value={form.tentangSaya}
                                        onChange={handleChange}
                                        placeholder="Ceritakan tentang Anda min. 200 karakter"
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-24 
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                                    />
                                </div>

                                <h3 className="font-semibold border-b pb-2">Kelahiran</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <InputField label="Tempat Lahir" name="tempatLahir" value={form.tempatLahir} onChange={handleChange} />
                                    <InputField label="Tanggal Lahir" name="tanggalLahir" type="date" value={form.tanggalLahir} onChange={handleChange} />
                                </div>

                                <h3 className="font-semibold border-b pb-2">Alamat</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <InputField label="Alamat" name="alamat" value={form.alamat} onChange={handleChange} />
                                        <InputField label="Provinsi" name="provinsi" value={form.provinsi} onChange={handleChange} />
                                        <InputField label="Kecamatan" name="kecamatan" value={form.kecamatan} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <InputField label="Kota/Kabupaten" name="kota" value={form.kota} onChange={handleChange} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label="RT" name="rt" value={form.rt} onChange={handleChange} />
                                            <InputField label="RW" name="rw" value={form.rw} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
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
            <ProfileHeader
                name={form.nama || "Putri Angreani"}
                email={form.email || "putriangreani@gmail.com"}
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