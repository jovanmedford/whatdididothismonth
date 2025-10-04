import { ComponentProps, ReactNode } from "react";
export default function FieldSet({
  legend,
  children,
  className,
  ...delegated
}: FieldsetProps) {
  return (
    <fieldset className={`py-4 px-4 rounded-lg border-1 border-primary-500 ${className ?? ""}`} {...delegated}>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
}

interface FieldsetProps extends ComponentProps<"fieldset"> {
  legend: ReactNode;
  className?: string;
}
