import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  UserType,
} from "@aws-sdk/client-cognito-identity-provider";
import { Result, UserInput } from "../shared/types";
import { err, success } from "../shared/utils";
import { users } from "../../data";

const cognitoClient = new CognitoIdentityProviderClient({});

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
    let newUsers: UserType[] = [];
    let listResponse = await cognitoClient.send(listCommand);
    let currentEmails = listResponse.Users?.map(getEmail);
    let emailSet = new Set(currentEmails);

    for (let input of userInputs) {
      if (!emailSet.has(input.email)) {
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
          newUsers.push(createResponse.User);
        }
      }
    }

    let newEmails = newUsers.map(getEmail);
    let newEmailSet = new Set(newEmails);

    return success(Array.from(emailSet.union(newEmailSet)));
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
      return err(e);
    }

    return err("An unknown error occured");
  }
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

const getEmail = (user: UserType): string | null => {
  if (!user.Attributes) {
    return null;
  }

  let attr = user.Attributes.find((attr) => attr.Name == "email");

  if (!attr) {
    return null;
  }

  return attr.Value ?? null;
};
