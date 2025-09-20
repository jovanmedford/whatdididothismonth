import { ReactNode } from "react";

export default function Section({ children }: { children: ReactNode }) {
  return <section className=" mx-auto py-10 md:py-12 2xl:py-40  w-11/12 md:w-10/12">{children}</section>;
}
