import Image from "next/image";
import LoginForm from "./login-form";

export default function Login() {
  return (
    <main className="flex h-screen">
      <section className="relative hidden md:flex w-2/5 flex-col justify-center">
        <Image
          src={
            "https://whatdididothismonth-imgs.s3.us-east-1.amazonaws.com/hands-up.webp"
          }
          fill={true}
          alt="Man walking scenic route with hands in the air"
        />
      </section>
      <section className="w-full md:w-3/5 flex flex-col justify-center mx-8 -mt-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep-blue-500">
            Welcome back!
          </h1>
          <p>Let's see how this month is going shall we?</p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
