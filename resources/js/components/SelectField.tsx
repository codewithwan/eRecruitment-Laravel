import React from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Option[];
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
    label,
    name,
    value,
    onChange,
    options,
    required = false,
    disabled = false,
    className = ''
}) => {
    // Ensure value is never undefined or null
    const safeValue = value ?? '';

    return (
        <div className={`flex flex-col ${className}`}>
            <label htmlFor={name} className="text-sm font-medium text-gray-900 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
                id={name}
                name={name}
                value={safeValue}
                onChange={onChange}
                required={required}
                disabled={disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 bg-white"
            >
                {options.map((option, index) => (
                    <option key={`${option.value}-${index}`} value={option.value} className="text-gray-900">
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;
