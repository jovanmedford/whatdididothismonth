"use client";

import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import Button from "../_components/button/button";
import TextInput from "../_components/form/text-input";
import { autoSignIn, confirmSignUp, getCurrentUser } from "aws-amplify/auth";
import { showNotification } from "../_components/toast/toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Use this component to validate a user
 * @param config
 */
export default function Page() {
  let {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const router = useRouter();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      let email = localStorage.getItem("email");

      if (!email) {
        showNotification({
          type: "error",
          title: "Error",
          description: "No email address found, try logging in to validate.",
        });
        return router.push("/login");
      }

      const { nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: data.confirmationCode,
      });

      if (nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
        // Call `autoSignIn` API to complete the flow
        const { nextStep } = await autoSignIn();

        if (nextStep.signInStep === "DONE") {
          router.push("/app/calendar");
        }
      }
    } catch (e) {
      showNotification({
        type: "error",
        title: "Error",
        description: e.message,
      });
      console.log(e);
    }
  };

  return (
    <>
      <div className="w-6/8 max-w-xl mx-auto">
        <h1 className="text-center font-bold text-2xl mb-16 mt-60">
          Verify your email address
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-end"
        >
          <Controller
            name="confirmationCode"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <TextInput
                {...field}
                errors={errors.confirmationCode}
                className="mb-4"
                label="Verification Code"
                type="text"
              />
            )}
          />
          <Button variant="emphasized">Submit</Button>
        </form>
      </div>
    </>
  );
}

export interface ConfirmationConfiguration {
  onSubmit: (data: any) => void;
}
