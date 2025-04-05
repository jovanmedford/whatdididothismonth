import { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export default function TextInput({
  label,
  type,
  className,
  error,
  ...props
}: TextInputProps) {
  return (
    <>
      <label className="w-full block">
        {label}:
        <input
          {...props}
          className={className + " " + "border-1 block w-full"}
          type={type}
        />
        {error ? <p className="mb-4 text-red-600">{error.message}</p> : null}
      </label>
    </>
  );
}
