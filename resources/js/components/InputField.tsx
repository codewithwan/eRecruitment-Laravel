import React, { ChangeEvent } from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  step?: string;
  min?: string;
  max?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled
}) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                text-black bg-white disabled:bg-gray-100"
    />
  </div>
);

export default InputField;

