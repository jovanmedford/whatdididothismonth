import { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

export default function Select({
  label,
  className,
  error,
  options,
  ...props
}: SelectProps) {
  return (
    <>
      <label className="w-full block">
        {label}:
        <select
          {...props}
          className={className + " " + "border-1 block w-full"}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {error ? <p className="mb-4 text-red-600">{error.message}</p> : null}
      </label>
    </>
  );
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: FieldError;
}

export interface Option<T = any> {
  label: string;
  value: string;
  data: T;
}
