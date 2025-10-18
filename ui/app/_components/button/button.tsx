import { ComponentProps, FC } from "react";
import { LucideProps } from "lucide-react";
import "./button.css";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "default" | "emphasized";
  size?: "small" | "medium" | "large";
  icon?: FC<LucideProps & ComponentProps<"svg">>;
}

export default function Button({
  icon: Icon,
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
      {Icon && (
        <Icon className={`${iconColor[variant]}`} size={iconSize[size]} />
      )}
      {children}
    </button>
  );
}

const iconSize = {
  small: 20,
  medium: 20,
  large: 20,
};

const iconColor = {
  default: "text-text",
  emphasized: "text-white",
};
