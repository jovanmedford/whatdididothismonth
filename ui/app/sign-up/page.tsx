import Logo from "../_components/logo/logo";
import Plant from "./plant";
import SignUpForm from "./sign-up-form";
import Image from "next/image";

export default function SignUp() {
  return (
    <main className="flex h-screen">
      <section className="relative hidden md:flex w-1/2 flex-col justify-center">
        <Image
          className="object-cover"
          fill={true}
          src="/sign-up-image.svg"
          alt="Big plant"
        ></Image>
      </section>
      <section className="flex w-full md:w-1/2">
        <div className="w-3/4 mx-auto mt-10 md:mt-20">
          <Logo className="mb-12 md:mb-16" />
          <div className="mb-10">
            <h1 className="mb-8 text-2xl font-bold text-deep-blue-500">Sign up</h1>
            <p className="mb-8">Track your journey, not just your streaks.</p>
          </div>
          <SignUpForm></SignUpForm>
          <Plant></Plant>
        </div>
      </section>
    </main>
  );
}
