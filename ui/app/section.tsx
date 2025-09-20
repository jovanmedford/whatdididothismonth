import { ReactNode } from "react";

export default function Section({ children }: { children: ReactNode }) {
  return <section className=" mx-auto py-12 2xl:py-40 w-10/12">{children}</section>;
}
