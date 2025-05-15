import React, { ChangeEvent } from 'react';
import InputField from '../InputField';

interface TwoColumnFormProps {
    title: string;
    inputLabel: string;
    inputName: string;
    inputValue: string;
    inputPlaceholder: string;
    fileLabel: string;
    fileName: string;
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBack: () => void;
}

const TwoColumnForm: React.FC<TwoColumnFormProps> = ({
    title,
    inputLabel,
    inputName,
    inputValue,
    inputPlaceholder,
    fileLabel,
    fileName,
    onInputChange,
    onFileChange,
    onBack
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-blue-600">{title}</h2>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <InputField
                            label={inputLabel}
                            name={inputName}
                            value={inputValue}
                            onChange={onInputChange}
                            placeholder={inputPlaceholder}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            {fileLabel}
                        </label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="file"
                                name={fileName}
                                onChange={onFileChange}
                                accept=".pdf,.jpg,.jpeg,.doc,.docx"
                                className="hidden"
                                id={fileName}
                            />
                            <label
                                htmlFor={fileName}
                                className="px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                            >
                                Pilih File
                            </label>
                            <span className="text-sm text-gray-500">
                                Format file yang didukung: .pdf, .jpg, .jpeg, .doc, .docx
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mt-6">
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
            </div>
        </div>
    );
};

export default TwoColumnForm;