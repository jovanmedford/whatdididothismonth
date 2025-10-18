import React, { ComponentProps, ReactNode, useId } from "react";

export default function Input({
  label,
  errorMessage,
  className,
  after,
  ...delegated
}: InputProps) {
  const id = useId();
  return (
    <div className={className ? className : ""}>
      <label htmlFor={id} className="w-full block">
        {label}:
      </label>
      <div className="flex">
        <input {...delegated} id={id} className={"border-1 block w-full"} />
        {after}
      </div>
      {errorMessage ? (
        <p className="mb-4 text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}

interface InputProps extends ComponentProps<"input"> {
  label: string;
  className?: string;
  errorMessage?: string;
  after?: ReactNode;
}
