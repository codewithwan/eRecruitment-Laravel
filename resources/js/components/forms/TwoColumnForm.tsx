import React, { ChangeEvent, FormEvent } from 'react';
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
    onSubmit?: () => void;
    hideSubmitButton?: boolean;
    loading?: boolean;
    submitButtonText?: string; // Tambahkan prop untuk custom text
}

const TwoColumnForm: React.FC<TwoColumnFormProps> = (props) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (props.onSubmit) {
            props.onSubmit();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-600">{props.title}</h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        {props.inputLabel}
                    </label>
                    <input
                        type="text"
                        name={props.inputName}
                        value={props.inputValue}
                        onChange={props.onInputChange}
                        placeholder={props.inputPlaceholder}
                        className="w-full border border-gray-300 rounded p-2 text-gray-700"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        {props.fileLabel}
                    </label>
                    <input
                        type="file"
                        name={props.fileName}
                        onChange={props.onFileChange}
                        className="w-full border border-gray-300 rounded p-2 text-gray-700"
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={props.onBack}
                        className="text-gray-600 hover:text-gray-700"
                    >
                        Kembali
                    </button>
                    
                    {/* Render submit button conditionally based on hideSubmitButton prop */}
                    {!props.hideSubmitButton && (
                        <button
                            type="submit"
                            disabled={props.loading}
                            className={`bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 ${
                                props.loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {props.loading 
                                ? 'Menyimpan...' 
                                : (props.submitButtonText || 'Save & Next')
                            }
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TwoColumnForm;