import React from 'react';

interface Option {
    value: string | number;  // Modified to accept both string and number
    label: string;
}

interface SelectFieldProps {
    label: string;
    name: string;
    value: string | number;  // Modified to accept both string and number
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
    // Convert value to string to ensure compatibility with select element
    const safeValue = value?.toString() ?? '';

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
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 bg-white focus:outline-none"
            >
                {options.map((option, index) => (
                    <option 
                        key={`${option.value}-${index}`} 
                        value={option.value.toString()} 
                        className="text-gray-900"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;
