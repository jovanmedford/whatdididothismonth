"use client";
import Button from "../_components/button/button";
import Input from "../_components/form/input";
import { Amplify } from "aws-amplify";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signUpUser } from "../utils";
import { amplifyConfig } from "@/amplify_config";

Amplify.configure(amplifyConfig);

export default function SignUpForm() {
  const router = useRouter();
  let {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<SignUpFormData>();

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    signUpUser(data, router);
  };

  return (
    <form className="flex flex-col max-w-md" onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("username", {
          required: "This field is required",
          pattern: {
            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: "Invalid email",
          },
        })}
        errorMessage={errors?.username?.message}
        className="mb-4"
        label="Email"
        type="email"
      />
      <Input
        {...register("password", {
          required: "This field is required",
        })}
        errorMessage={errors?.password?.message}
        className="mb-4"
        label="Password"
        type="password"
      />
      <Button variant="emphasized" className="mt-8">
        Create New Account
      </Button>
    </form>
  );
}

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}
