"use client";

import Button from "../_components/button/button";
import TextInput from "../_components/form/text-input";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginUser } from "../utils";

Amplify.configure(outputs);

export const LoginForm = () => {
  const router = useRouter();
  let {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    loginUser(data, router);
  };

  return (
    <form className="flex flex-col max-w-sm" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        rules={{
          required: "This field is required",
          pattern: {
            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: "Invalid email",
          },
        }}
        render={({ field }) => (
          <TextInput
            {...field}
            errors={errors.email}
            className="mb-4"
            label="Email"
            type="text"
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{ required: "This field is required" }}
        render={({ field }) => (
          <TextInput
            {...field}
            errors={errors.password}
            className="mb-4"
            label="Password"
            type="password"
          />
        )}
      />
      <Button className="mt-8" variant="emphasized">
        Login
      </Button>
    </form>
  );
};

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
          <p>"Let's see how this month is going shall we?"</p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
