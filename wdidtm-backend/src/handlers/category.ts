import { Client } from "pg";
import CategoryService from "../shared/services/category";
import { NO_CLIENT_MESSAGE } from "../shared/errors.js";
import { APIGatewayProxyEvent } from "aws-lambda";

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

export const handler = async (event: APIGatewayProxyEvent) => {
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
  const categoryService = new CategoryService(client);

  if (!client) {
    console.error(NO_CLIENT_MESSAGE);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify("An error occured."),
    };
  }

  

  const userId = event.requestContext!.authorizer!.claims.sub;

  let result = await categoryService.findAllByUser(userId);

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
