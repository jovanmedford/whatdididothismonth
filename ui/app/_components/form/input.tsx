import { InputHTMLAttributes, Ref, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string;
  ref?: Ref<HTMLInputElement>;
}

export default function Input({
  label,
  type,
  className = "",
  errorMessage,
  ref,
  ...delegated
}: InputProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="w-full block">
        {label}:
      </label>
      <input
        {...delegated}
        id={id}
        className={className + " " + "border-1 block w-full"}
        type={type}
        ref={ref}
      />
      {errorMessage ? (
        <p className="mb-4 text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}
