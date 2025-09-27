"use client";
import { Amplify } from "aws-amplify";
import Button from "../_components/button/button";
import Input from "../_components/form/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LoginData, loginUser } from "./loginUser";
import { amplifyConfig } from "@/amplify_config";
Amplify.configure(amplifyConfig);

export default function LoginForm() {
  const router = useRouter();
  let {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<LoginData>();

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    loginUser(data, router);
  };

  return (
    <form className="flex flex-col max-w-sm" onSubmit={handleSubmit(onSubmit)}>
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
      <Button className="mt-8" variant="emphasized">
        Login
      </Button>
    </form>
  );
}
