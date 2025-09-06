import { executeQuery } from "../shared/utils";
import { Client } from "pg";
import insertCategoryQuery from "@queries/insert-category.sql";
import { User } from "../shared/types";

let client: Client | null = null;

const getDbClient = async () => {
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

  return client;
};

export const handler = async () => {
  let client = await getDbClient();


  const categoryResult = await executeQuery(client, insertCategoryQuery, );

  if (!categoryResult.ok) {
    return categoryResult.message;
  }

  return "Success!";
};

let users: User[] = [
    {}
]