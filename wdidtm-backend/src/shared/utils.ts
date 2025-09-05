import { ErrorResult, Result, SuccessResult } from "./types";
import { Client } from "pg";

export const executeQuery = async (
  client: Client,
  query: string,
  params?: any[]
): Promise<Result> => {
  try {
    const result = await client.query(query, params);
    return { ok: true, data: result };
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
      return { ok: false, message: e.message };
    }
    return { ok: false, message: "An unknown error occured" };
  }
};

export const success = <T>(data: T): SuccessResult => ({ ok: true, data });
export const err = (error: string | Error): ErrorResult => ({
  ok: false,
  message: typeof error === "string" ? error : error.message,
});
