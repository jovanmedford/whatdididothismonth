import Image from "next/image";

type LogoProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function Logo({
  className,
  width = 120,
  height = 40,
}: LogoProps) {
  return (
    <>
      <Image
        src="/wdidtm-mobile-logo.svg"
        alt="WhatDidIDoThisMonth Logo"
        width={width}
        height={height}
        priority
        className={`${className ?? ""} md:hidden`}
      />
      <Image
        src="/wdidtm-full-logo.svg"
        alt="WhatDidIDoThisMonth Logo"
        width={width * 2.5}
        height={height}
        priority
        className={`${className ?? ""} hidden md:block`}
      />
    </>
  );
}
