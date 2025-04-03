import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { signIn, SignInOutput } from "aws-amplify/auth";
import { showNotification } from "../_components/toast/toast";
import { LoginResult } from "./login.test";

export async function login(
  user: { username: string; password: string },
  signInFn: typeof signIn = signIn
): Promise<LoginResult> {
  try {
    const output = await signInFn(user);
    return { success: true, data: output };
  } catch (e) {
    let error = e as Error;
    return { success: false, message: error.message || "An error occured" };
  }
}

export function processSignInOutput(
  output: SignInOutput,
  router: AppRouterInstance
): void {
  if (output.nextStep.signInStep == "CONFIRM_SIGN_UP") {
    router.push("verify");
  }

  if (output.nextStep.signInStep == "DONE") {
    router.push("app/calendar");
  }
}

export async function loginUser(
  data: { username: string; password: string },
  router: AppRouterInstance
) {
  const result = await login(data);

  if (result.success) {
    processSignInOutput(result.data, router);
    return;
  }

  showNotification({
    type: "error",
    title: "Error",
    description: result.message || "Error signing in",
  });
}

export interface LoginData {
  username: string;
  password: string;
}
