import React, { ChangeEvent } from 'react';
import TwoColumnForm from './TwoColumnForm';

interface DataTambahanFormProps {
    onTambahSkills: () => void;
    onTambahKursus: () => void;
    onTambahSertifikasi: () => void;
    onTambahBahasa: () => void;
    onTambahEnglishCert: () => void;
}

interface DataTambahanFormState {
    activeForm: string | null;
    formData: {
        [key: string]: {
            name: string;
            file: File | null;
        };
    };
}

const DataTambahanForm: React.FC<DataTambahanFormProps> = ({
    onTambahSkills,
    onTambahKursus,
    onTambahSertifikasi,
    onTambahBahasa,
    onTambahEnglishCert
}) => {
    const [state, setState] = React.useState<DataTambahanFormState>({
        activeForm: null,
        formData: {}
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState(prev => ({
            ...prev,
            formData: {
                ...prev.formData,
                [state.activeForm!]: {
                    ...prev.formData[state.activeForm!],
                    name: value
                }
            }
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setState(prev => ({
            ...prev,
            formData: {
                ...prev.formData,
                [state.activeForm!]: {
                    ...prev.formData[state.activeForm!],
                    file
                }
            }
        }));
    };

    if (state.activeForm === 'skills') {
        return (
            <TwoColumnForm
                title="Skills/Kemampuan"
                inputLabel="Nama Skill"
                inputName="skillName"
                inputValue={state.formData.skills?.name || ''}
                inputPlaceholder="Masukkan nama skill"
                fileLabel="Upload Sertifikat Skill"
                fileName="skillFile"
                onInputChange={handleInputChange}
                onFileChange={handleFileChange}
                onBack={() => setState(prev => ({ ...prev, activeForm: null }))}
            />
        );
    }

    if (state.activeForm === 'kursus') {
        return (
            <TwoColumnForm
                title="Kursus atau Training"
                inputLabel="Nama Kursus"
                inputName="kursusName"
                inputValue={state.formData.kursus?.name || ''}
                inputPlaceholder="Masukkan nama kursus"
                fileLabel="Upload Sertifikat Kursus"
                fileName="kursusFile"
                onInputChange={handleInputChange}
                onFileChange={handleFileChange}
                onBack={() => setState(prev => ({ ...prev, activeForm: null }))}
            />
        );
    }

    if (state.activeForm === 'sertifikasi') {
        return (
            <TwoColumnForm
                title="Sertifikasi"
                inputLabel="Nama Sertifikasi"
                inputName="sertifikasiName"
                inputValue={state.formData.sertifikasi?.name || ''}
                inputPlaceholder="Masukkan nama sertifikasi"
                fileLabel="Upload Sertifikat"
                fileName="sertifikasiFile"
                onInputChange={handleInputChange}
                onFileChange={handleFileChange}
                onBack={() => setState(prev => ({ ...prev, activeForm: null }))}
            />
        );
    }

    if (state.activeForm === 'bahasa') {
        return (
            <TwoColumnForm
                title="Penguasaan Bahasa"
                inputLabel="Bahasa"
                inputName="bahasaName"
                inputValue={state.formData.bahasa?.name || ''}
                inputPlaceholder="Masukkan bahasa yang dikuasai"
                fileLabel="Upload Sertifikat Bahasa (opsional)"
                fileName="bahasaFile"
                onInputChange={handleInputChange}
                onFileChange={handleFileChange}
                onBack={() => setState(prev => ({ ...prev, activeForm: null }))}
            />
        );
    }

    if (state.activeForm === 'englishCert') {
        return (
            <TwoColumnForm
                title="English Certification"
                inputLabel="Nama Sertifikasi"
                inputName="englishCertName"
                inputValue={state.formData.englishCert?.name || ''}
                inputPlaceholder="Masukkan nama sertifikasi bahasa Inggris"
                fileLabel="Upload Sertifikat"
                fileName="englishCertFile"
                onInputChange={handleInputChange}
                onFileChange={handleFileChange}
                onBack={() => setState(prev => ({ ...prev, activeForm: null }))}
            />
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm text-black">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-600">Data Tambahan</h2>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    Lengkapi data tambahan di bawah ini
                </p>
            </div>

            <div className="p-6 space-y-6">
                <section>
                    <h3 className="text-lg font-semibold mb-2 text-black">Skills/Kemampuan</h3>
                    <p className="text-sm text-gray-600 mb-4">Skills apa yang Anda miliki?</p>
                    <button
                        type="button"
                        onClick={() => setState(prev => ({ ...prev, activeForm: 'skills' }))}
                        className="text-blue-600 text-sm hover:text-blue-700"
                    >
                        + Tambah Skills
                    </button>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-2 text-black">Kursus atau Training</h3>
                    <p className="text-sm text-gray-600 mb-4">Apakah Anda memiliki riwayat kursus yang pernah diikuti?</p>
                    <button
                        type="button"
                        onClick={() => setState(prev => ({ ...prev, activeForm: 'kursus' }))}
                        className="text-blue-600 text-sm hover:text-blue-700"
                    >
                        + Tambah Kursus atau Training
                    </button>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-2 text-black">Sertifikasi</h3>
                    <p className="text-sm text-gray-600 mb-4">Apakah Anda memiliki sertifikasi sebelumnya?</p>
                    <button
                        type="button"
                        onClick={() => setState(prev => ({ ...prev, activeForm: 'sertifikasi' }))}
                        className="text-blue-600 text-sm hover:text-blue-700"
                    >
                        + Tambah Sertifikasi
                    </button>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-2 text-black">Penguasaan Bahasa</h3>
                    <p className="text-sm text-gray-600 mb-4">Bahasa apa yang Anda kuasai?</p>
                    <button
                        type="button"
                        onClick={() => setState(prev => ({ ...prev, activeForm: 'bahasa' }))}
                        className="text-blue-600 text-sm hover:text-blue-700"
                    >
                        + Tambah Bahasa
                    </button>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-2 text-black">English Certification</h3>
                    <p className="text-sm text-gray-600 mb-4">Sertifikasi bahasa inggris apa yang Anda punya?</p>
                    <button
                        type="button"
                        onClick={() => setState(prev => ({ ...prev, activeForm: 'englishCert' }))}
                        className="text-blue-600 text-sm hover:text-blue-700"
                    >
                        + Tambah English Certification
                    </button>
                </section>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Save & Next
                </button>
            </div>
        </div>
    );
};

export default DataTambahanForm;