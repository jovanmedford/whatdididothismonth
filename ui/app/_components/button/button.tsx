import { ButtonHTMLAttributes } from "react";
import "./button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "emphasized";
  size?: "small" | "medium" | "large";
}

export default function Button({
  variant = "default",
  size = "medium",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={props.className + ` btn btn-${variant} btn-${size}`}
    >
      {children}
    </button>
  );
}
