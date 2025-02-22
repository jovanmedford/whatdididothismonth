"use client";

import Button from "../_components/button/button";
import TextInput from "../_components/form/text-input";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { Controller, useForm } from "react-hook-form";

Amplify.configure(outputs);

export default function SignUp() {
  let {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <main className="flex h-screen">
      <section className="hidden md:flex w-1/2 flex-col justify-center">
        <p className="text-center">Another Nice Picture</p>
      </section>
      <section className="w-full md:w-1/2 flex flex-col justify-center mx-8 -mt-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep-blue-500">
            Consistency is key.
          </h1>
          <p>
            {" "}
            By focusing on winning each day we can accomplish incredible things.
          </p>
        </div>
        <form
          className="flex flex-col max-w-md "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex gap-x-4">
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  errors={errors.firstName}
                  className="mb-4"
                  label="First Name"
                  type="text"
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  errors={errors.lastName}
                  className="mb-4"
                  label="Last Name"
                  type="text"
                />
              )}
            />
          </div>

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
          <Button variant="emphasized" className="mt-8">
            Create New Account
          </Button>
        </form>
      </section>
    </main>
  );
}
