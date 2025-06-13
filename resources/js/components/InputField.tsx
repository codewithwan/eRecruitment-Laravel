import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  step?: string;
  min?: string | number;
  max?: string | number;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  step,
  min,
  max,
  className = '',
}) => {
  return (
    <div className="mb-5"> {/* Increase bottom margin from default to mb-5 */}
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2"> {/* Increase label bottom margin from mb-1 to mb-2 */}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        step={step}
        min={min}
        max={max}
        className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${disabled ? 'bg-gray-100' : 'bg-white'} ${className}`}
        
      />
    </div>
  );
};

export default InputField;

