import {  executeQuery } from "../shared/utils";
import { Client } from "pg";
import insertUserQuery from "@queries/insert-user.sql";
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

export const handler = async (event: { users: User[] }) => {
  let client = await getDbClient();
  let users = event.users;

  let errors: string[] = [];

  for (let user of users) {
    let insertResult = await executeQuery<User>(client, insertUserQuery, [
      user.id,
      user.email,
    ]);

    if (!insertResult.ok) {
      errors.push(insertResult.message);
    }
  }

  if (errors.length === 0) {
    return "Success!";
  }

  return errors;
};
