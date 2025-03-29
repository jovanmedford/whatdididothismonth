import { ResourcesConfig } from "aws-amplify";

export let amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.USER_POOL_ID || "",
      userPoolClientId: process.env.USER_POOL_CLIENT_ID || "",
      identityPoolId: process.env.IDENTITY_POOL_ID || "",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
};
