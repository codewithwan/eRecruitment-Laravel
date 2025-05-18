import React, { ChangeEvent } from 'react';

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder
}) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                text-black bg-white"
    >
      <option value="">{placeholder || "Pilih..."}</option>
      {options.map(option => (
        <option key={option} value={option} className="text-black">
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;
