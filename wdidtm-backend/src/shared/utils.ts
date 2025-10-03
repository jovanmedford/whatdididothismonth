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

export const getDbClient = async (client: Client | undefined) => {
  if (client) {
    return client;
  }

  client = new Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT || 5432),
    host: process.env.DB_PROXY_ENDPOINT,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: true,
    },
  });

   await client.connect();
   return client
};
