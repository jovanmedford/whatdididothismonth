import { Client } from "pg";
import ActivityService from "../shared/services/activity";
import { NO_CLIENT_MESSAGE } from "../shared/errors.mjs";

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

export const handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
  };

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed." }),
    };
  }

  let client = await getDbClient();

  if (!client) {
    console.error(NO_CLIENT_MESSAGE);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify("An error occured."),
    };
  }

  let params = event.queryStringParameters;

  const categoryId =
    params && params.categoryId
      ? event.queryStringParameters.categoryId
      : null;

  const userId = event.requestContext.authorizer.claims.sub;

  // Get by category
  if (categoryId) {
    let result = await ActivityService.getByCategory!(client, categoryId);

    if (!result.ok) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify(result.message),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.data),
    };
  }

  // Get by user
  let result = await ActivityService.getByUser!(client, userId);

  if (!result.ok) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify(result.message),
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(result.data),
  };
};
