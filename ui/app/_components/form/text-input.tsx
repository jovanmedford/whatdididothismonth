import { InputHTMLAttributes } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errors?: FieldErrors<FieldValues>;
}

export default function TextInput({
  label,
  type,
  className,
  errors,
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
        {errors ? <p className="mb-4 text-red-600">{errors?.message}</p> : null}
      </label>
    </>
  );
}
