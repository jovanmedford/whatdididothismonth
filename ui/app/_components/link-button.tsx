import Link from "next/link";
import { PropsWithChildren } from "react";

export default function LinkButton({
  children,
  href,
  className
}: PropsWithChildren<{ href: string, className?: string }>) {
  return (
    <Link
      href={href}
      className={`bg-primary-500 text-white py-3 px-4 rounded-3xl hover:cursor-pointer ${className}`}
    >
      {children}
    </Link>
  );
}
