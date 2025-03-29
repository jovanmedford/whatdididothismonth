import { ButtonHTMLAttributes } from "react";
import "./button.css"


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "emphasized"
}

export default function Button({ variant = "default", children, ...props}: ButtonProps) {
  return (
    <button
      {...props}
      className={props.className + ` btn btn-${variant} ` + "py-2 px-4"}
    >
      {children}
    </button>
  );
}
