import { fetchAuthSession, signUp } from "aws-amplify/auth";
import { showNotification } from "./_components/toast/toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AuthError } from "@aws-amplify/auth";
import { loginUser } from "./login/loginUser";

export async function signUpUser(
  data: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
  },
  router: AppRouterInstance
) {
  try {
    const { nextStep: signUpNextStep } = await signUp({
      username: data.username,
      password: data.password,
      options: {
        userAttributes: {
          email: data.username,
          given_name: data.firstName,
          family_name: data.lastName,
        },
        autoSignIn: {
          signInOptions: "USER_AUTH",
        },
      },
    });

    if (signUpNextStep.signUpStep === "CONFIRM_SIGN_UP") {
      localStorage.setItem("email", data.username);
      return router.push("verify");
    }

    return router.push("app/calendar");
  } catch (e) {
    if (e instanceof AuthError) {
      if (e.name == "UsernameExistsException") {
        return loginUser(data, router);
      }
    }

    if (e instanceof Error) {
      showNotification({
        type: "error",
        title: "Error",
        description: e.message,
      });
    }

    console.log(e);
  }
}

async function getAuthSession() {
  try {
    const authSession = await fetchAuthSession();
    return authSession;
  } catch (e) {
    if (e instanceof Error) {
      showNotification({
        type: "error",
        title: "Error",
        description: e.message,
      });
    }
  }
}

export const generateArray = (start: number, end: number) => {
  let arr = [];
  for (let i = start; i < end; i++) {
    arr.push(i + 1);
  }
  return arr;
};
