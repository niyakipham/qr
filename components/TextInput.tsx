
import React from 'react';

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  isTextarea?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ id, label, value, onChange, placeholder, isTextarea = false }) => {
  const commonClasses = "w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition duration-300 shadow-sm";
  const focusClasses = `focus:ring-[${'#86A8E7'}] focus:border-[${'#86A8E7'}]`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {isTextarea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={2}
          className={`${commonClasses} ${focusClasses.replace('[#86A8E7]', '#91EAE4')}`}
          style={{ '--tw-ring-color': '#86A8E7' } as React.CSSProperties}
        />
      ) : (
        <input
          type="text"
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${commonClasses} ${focusClasses}`}
          style={{ '--tw-ring-color': '#86A8E7' } as React.CSSProperties}
        />
      )}
    </div>
  );
};
