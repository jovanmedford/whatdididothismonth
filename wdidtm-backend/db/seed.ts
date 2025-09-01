import { Client } from "pg";
import { readFile } from "fs/promises";
import { exit } from "process";

seed().then(() => console.log("FINISHED"));

export default async function seed() {
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_DATABASE,
  });

  try {
    await client.connect();
  } catch (e) {
    console.error(e);
  }

  const createResult = await createTables(
    client,
    process.env.INIT_TABLES_PATH ?? "init.sql"
  );

  if (!createResult.ok) {
    exit(1);
  }

  exit(0);
}

const createTables = async (client: Client, path: string): Promise<Result> => {
  try {
    const script = await readFile(path, "utf8");
    const result = await client.query(script);
    return { ok: true, data: "Success!" };
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
      return { ok: false, message: e.message };
    }
    return { ok: false, message: "An unknown error occured" };
  }
};

type Result<T = any> = SuccessResult<T> | ErrorResult;

interface SuccessResult<T = any> {
  ok: true;
  data: T;
}

interface ErrorResult {
  ok: false;
  message: string;
}

export interface UserInput {
  email: string;
  firstName: string;
  lastName: string;
}

export interface CategoryInput {
  label: string;
  color: string;
  icon: string;
}

export interface ActivityInput {
  label: string;
}

export interface ActivityLogInput {
  year: number;
  month: number;
  target: number;
}

export interface SuccessLogInput {
  day: number;
}
