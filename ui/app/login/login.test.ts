import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { login, processSignInOutput } from "./loginUser";
import { signIn, SignInOutput } from "aws-amplify/auth";

describe("login", () => {
  it("returns next step if successful", async () => {
    let signInFn = createSignInMock();
    let result: LoginResult = await login(JANE, signInFn);

    expectToBeTrue(result.success);
    expect(result.data).toHaveProperty("nextStep");
  });

  it("returns message if error", async () => {
    let signInFn = createSignInMock();
    let result: LoginResult = await login(
      { username: JANE.username, password: "wrong" },
      signInFn
    );

    expectToBeFalse(result.success);
    expect(result.message).toBeDefined();
  });
});

describe("processNextStep", () => {
  it("DONE -> go to app", () => {
    let output: SignInOutput = {
      isSignedIn: true,
      nextStep: { signInStep: "DONE" },
    };
    let router = useMockRouter();

    processSignInOutput(output, router);
    expect(router.push).toHaveBeenCalledWith("app/calendar");
  });

  it("CONFIRM_SIGN_UP -> go to verify", () => {
    let output: SignInOutput = {
      isSignedIn: true,
      nextStep: { signInStep: "CONFIRM_SIGN_UP" },
    };

    let router = useMockRouter();

    processSignInOutput(output, router);
    expect(router.push).toHaveBeenCalledWith("verify");
  });
});

/** Helpers */

const JANE = {
  username: "jane@email.com",
  password: "test",
};

let useMockRouter = () => {
  return {
    push: jest.fn((href) => console.log(`Went to ${href}`)),
  } as unknown as AppRouterInstance;
};

export type LoginResult = Result<SignInOutput>;

function expectToBeTrue(actual: unknown): asserts actual is true {
  expect(actual).toBe(true);
}

function expectToBeFalse(actual: unknown): asserts actual is false {
  expect(actual).toBe(false);
}

let createSignInMock = () =>
  jest.fn((user) => {
    if (user.username == JANE.username && user.password == JANE.password) {
      return {
        isSignedIn: true,
        nextStep: { signInStep: "CONFIRM_SIGN_UP" },
      };
    }

    throw Error("An error was thrown");
  }) as unknown as typeof signIn;
