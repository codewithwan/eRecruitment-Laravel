import React, { ChangeEvent, FormEvent, useState } from 'react';
import InputField from '../InputField';
import SelectField from '../SelectField';

interface TambahSkillsFormProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onBack: () => void;
}

interface SkillsFormState {
    namaSkill: string;
    tingkatKeahlian: string;
}

const TambahSkillsForm: React.FC<TambahSkillsFormProps> = ({
    onSubmit,
    onChange,
    onBack
}) => {
    const [formData, setFormData] = useState<SkillsFormState>({
        namaSkill: '',
        tingkatKeahlian: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        onChange(e);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-600">Skills/Kemampuan</h2>
                </div>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-6">
                <InputField
                    label="Nama Skill"
                    name="namaSkill"
                    value={formData.namaSkill}
                    onChange={handleChange}
                    placeholder="Masukkan nama skill"
                />

                <SelectField
                    label="Tingkat Keahlian"
                    name="tingkatKeahlian"
                    value={formData.tingkatKeahlian}
                    onChange={handleChange}
                    options={[
                        "Pilih tingkat keahlian",
                        "Pemula",
                        "Menengah",
                        "Mahir",
                        "Ahli"
                    ]}
                />

                <button
                    type="button"
                    className="text-red-500 hover:text-red-700 text-sm"
                >
                    - Hapus Skill
                </button>

                <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                >
                    + Tambah Skill
                </button>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-gray-600 hover:text-gray-700"
                    >
                        Kembali
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700"
                    >
                        Save & Next
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TambahSkillsForm;