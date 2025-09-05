import { executeQuery } from "../shared/utils";
import { Client } from "pg";
import createTablesQuery from "@queries/init.sql";

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
  let userPoolId = process.env.USER_POOL_ID;

  if (!userPoolId) {
    return "No user pool Id provided.";
  }

  const tablesResult = await executeQuery(client, createTablesQuery);

  if (!tablesResult.ok) {
    return tablesResult.message;
  }

  return "Success!";
};
