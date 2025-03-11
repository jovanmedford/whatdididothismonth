import { fetchAuthSession, signIn, signUp } from "aws-amplify/auth";
import { showNotification } from "./_components/toast/toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { data as amplifyData } from "../amplify/data/resource"

export async function loginUser(
  data: { email: string; password: string },
  router: AppRouterInstance
) {
  try {
    const { nextStep: signUpNextStep } = await signIn({
      username: data.email,
      password: data.password,
    });

    if (signUpNextStep.signInStep == "CONFIRM_SIGN_UP") {
      router.push("verify");
    }

    router.push("app/calendar");
  } catch (e) {
    if (e.name == "UserAlreadyAuthenticatedException") {
      return router.push("app/calendar");
    }

    showNotification({
      type: "error",
      title: "Error",
      description: e.message,
    });
  }
}

export async function signUpUser(
  data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  },
  router: AppRouterInstance
) {
  try {
    const { nextStep: signUpNextStep } = await signUp({
      username: data.email,
      password: data.password,
      options: {
        userAttributes: {
          email: data.email,
          given_name: data.firstName,
          family_name: data.lastName,
        },
        autoSignIn: {
          signInOptions: "USER_AUTH",
        },
      },
    });

    if (signUpNextStep.signUpStep === "CONFIRM_SIGN_UP") {
      localStorage.setItem("email", data.email);
      return router.push("verify");
    }

    console.log(signUpNextStep);

    return router.push("app/calendar");
  } catch (e) {
    if (e.name == "UsernameExistsException") {
      return loginUser(data, router);
    }

    showNotification({
      type: "error",
      title: "Error",
      description: e.message,
    });
    console.log(e);
  }
}

async function getAuthSession() {
  try {
    const authSession = await fetchAuthSession();
    return authSession;
  } catch (e) {
    showNotification({
      type: "error",
      title: "Error",
      description: e.message,
    });
  }
}

let docClient: null | DynamoDBDocumentClient;

export async function createDynamoClient() {
  const authSession = await getAuthSession();

  if (!authSession) {
    docClient = null;
    return;
  }

  if (!docClient) {
    const client = new DynamoDBClient({
      region: "us-east-1",
      credentials: authSession.credentials,
    });
    docClient = DynamoDBDocumentClient.from(client);
  }
}

export function getDbClient() {
  return docClient;
}

// export function getTableName() {
//   console.log(amplifyData)
//   // return backend.data.resources.tables["Activity"].tableName
// }

export const generateArray = (start: number, end: number) => {
  let arr = [];
  for (let i = start; i < end; i++) {
    arr.push(i + 1);
  }
  return arr;
};
