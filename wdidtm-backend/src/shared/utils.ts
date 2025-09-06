import { ErrorResult, Result, SuccessResult } from "./types";
import { Client, QueryResultRow } from "pg";

export const executeQuery = async <T extends QueryResultRow>(
  client: Client,
  query: string,
  params?: any[]
): Promise<Result<T[]>> => {
  try {
    const result = await client.query<T>(query, params);

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
