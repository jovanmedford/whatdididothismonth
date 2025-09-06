import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  UserType,
} from "@aws-sdk/client-cognito-identity-provider";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { Result, UserInput } from "../shared/types";
import { err, success } from "../shared/utils";
import { users } from "../../data";

const cognitoClient = new CognitoIdentityProviderClient({});
const lambdaClient = new LambdaClient({});

export const handler = async () => {
  let userPoolId = process.env.USER_POOL_ID;

  if (!userPoolId) {
    return "No user pool id provided";
  }

  let usersResult = await createUsers(userPoolId, users);

  if (!usersResult.ok) {
    return usersResult.message;
  }

  return usersResult.data;
};

const createUsers = async (
  userPoolId: string,
  userInputs: UserInput[]
): Promise<Result<UserType[]>> => {
  const listCommand = new ListUsersCommand({
    UserPoolId: userPoolId,
  });

  try {
    let listResponse = await cognitoClient.send(listCommand);
    let userMap = new Map<string, UserType>();
    listResponse.Users?.forEach((cognitoUser) =>
      userMap.set(getEmail(cognitoUser), cognitoUser)
    );

    for (let input of userInputs) {
      if (!userMap.has(input.email)) {
        let createCommand = new AdminCreateUserCommand({
          UserPoolId: userPoolId,
          Username: input.email,
          UserAttributes: [
            {
              Name: "email",
              Value: input.email,
            },
          ],
        });
        let createResponse = await cognitoClient.send(createCommand);

        if (createResponse.User) {
          await setUserPassword(cognitoClient, userPoolId, input);
          userMap.set(getEmail(createResponse.User), createResponse.User);
        }
      }
    }

    let users = getUsersFromMap(userMap);

    let seedDbFunctionName = process.env.SEED_DB_FUNCTION_NAME;

    if (seedDbFunctionName) {
      let command = new InvokeCommand({
        FunctionName: seedDbFunctionName,
        InvocationType: "Event",
        Payload: JSON.stringify({ users }),
      });
      await lambdaClient.send(command);
    } else {
      console.error("No function name added - could not invoke");
    }

    return success(users);
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
      return err(e);
    }

    return err("An unknown error occured");
  }
};

const getUsersFromMap = (userMap: Map<string, UserType>) => {
  return Array.from(userMap.values()).map((userType) => ({
    id: getSub(userType),
    email: getEmail(userType),
  }));
};

const setUserPassword = async (
  cognitoClient: CognitoIdentityProviderClient,
  userPoolId: string,
  user: UserInput
) => {
  let command = new AdminSetUserPasswordCommand({
    UserPoolId: userPoolId,
    Username: user.email,
    Password: generatePassword(user.firstName),
    Permanent: true,
  });

  await cognitoClient.send(command);
};

function generatePassword(firstname: string): string {
  const base =
    firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();
  return `${base}123!`;
}

const getEmail = (user: UserType): string => {
  return getAttr(user, "email")!;
};

const getSub = (user: UserType): string => {
  return getAttr(user, "sub")!;
};

const getAttr = (user: UserType, targetAttr: string): string | null => {
  if (!user.Attributes) {
    return null;
  }

  let attr = user.Attributes.find((attr) => attr.Name == targetAttr);

  if (!attr) {
    return null;
  }

  return attr.Value ?? null;
};
