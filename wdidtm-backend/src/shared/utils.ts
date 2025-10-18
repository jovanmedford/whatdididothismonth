import { APIGatewayProxyEvent } from "aws-lambda";
import { ErrorResult, Result, SuccessResult } from "./types";
import { Client } from "pg";

export const executeQuery = async <T>(
  client: Client,
  query: string,
  params?: any[]
): Promise<Result<T[]>> => {
  try {
    const result = await client.query<T[]>(query, params);

    return success(result.rows);
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
      return err(e.message);
    }
    return err("An unknown error occured");
  }
};

export function expectToBeTruthy(actual: unknown): asserts actual is true {
  expect(actual).toBe(true);
}

export const success = <T>(data: T): SuccessResult => ({ ok: true, data });
export const err = (error: string | Error): ErrorResult => ({
  ok: false,
  message: typeof error === "string" ? error : error.message,
});

export const createInputValidator = <T>(params: (keyof T)[]) => {
  return (input: T) => {
    let missing = [];

    for (let param of params) {
      if (input[param] == null) {
        missing.push(param);
      }
    }

    if (missing.length > 0) {
      return err(`Missing the following: ${missing.join(",")}`);
    }

    return success(null);
  };
};

export const getDbClient = async (client?: Client) => {
  if (client) {
    return client;
  }

  let sslConfig = Boolean(process.env.DISABLE_SSL)
    ? {}
    : {
        ssl: {
          rejectUnauthorized: true,
        },
      };

  client = new Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT || "5432"),
    host: process.env.DB_PROXY_ENDPOINT,
    database: process.env.DB_NAME,
    ...sslConfig,
  });

  await client.connect();
  return client;
};

export const createDbClientGetter: () => (
  client?: Client
) => Promise<Client> = () => {
  return (client?: Client) => getDbClient(client);
};

export const createPostTestEvent = ({
  body,
  userId,
}: {
  body: string;
  userId: string;
}): APIGatewayProxyEvent => {
  let event: APIGatewayProxyEvent = {
    body: body,
    headers: {},
    multiValueHeaders: {},
    httpMethod: "POST",
    isBase64Encoded: false,
    path: "",
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {
      authorizer: {
        claims: {
          sub: userId,
        },
      },
      accountId: "",
      apiId: "",
      protocol: "",
      httpMethod: "",
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        clientCert: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: "",
        user: null,
        userAgent: null,
        userArn: null,
      },
      path: "",
      stage: "",
      requestId: "",
      requestTimeEpoch: 0,
      resourceId: "",
      resourcePath: "",
    },
    resource: "",
  };

  return event;
};
