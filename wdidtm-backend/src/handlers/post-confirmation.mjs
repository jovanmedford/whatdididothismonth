import { Client } from "pg";

const client = new Client({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_PROXY_ENDPOINT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
  },
});

await client.connect();

/**
 *
 * Handles cognito post confirmation event.
 */
export const handler = async (event) => {
  const userId = event.request.userAttributes.sub;
  const email = event.request.userAttributes.email;
  try {
    await client.query(
      `INSERT INTO users (id, email) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING;`,
      [userId, email]
    );
  } catch (e) {
    console.error(e);
  }

  return event;
};
