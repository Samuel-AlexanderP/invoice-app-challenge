import React from "react";

export interface InputFieldProps {
  id: string;
  label: string;
  type: React.HTMLInputTypeAttribute;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  errorText?: string;
  required?: boolean;
  autoComplete?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder = "",
  error = false,
  errorText = "",
  required = false,
  autoComplete = "off",
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1 text-secondary dark:text-secondary-dark"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`
          w-full px-3 py-2 rounded 
          bg-tertiaryBg dark:bg-tertiaryBg-dark 
          text-primary dark:text-primary-dark
          border ${error ? "border-red-500" : "border-border"} dark:${
          error ? "border-red-700" : "border-border-dark"
        }
          focus:outline-none 
          focus:ring 
          ${
            error
              ? "focus:ring-red-400 dark:focus:ring-red-600"
              : "focus:ring-blue-300 dark:focus:ring-blue-600"
          }
          transition-colors
        `}
      />

      {error && errorText && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {errorText}
        </p>
      )}
    </div>
  );
};
