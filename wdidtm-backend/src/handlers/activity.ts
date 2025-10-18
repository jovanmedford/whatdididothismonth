import { Client } from "pg";
import ActivityService from "../shared/services/activity";
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
  let activityService = new ActivityService(client);

  if (!client) {
    console.error(NO_CLIENT_MESSAGE);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify("An error occured."),
    };
  }

  if (!event.requestContext.authorizer) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Forbidden resource.",
      }),
    };
  }

  const categoryId = event?.queryStringParameters?.categoryId;

  const userId = event.requestContext.authorizer.claims.sub;

  // Get by category
  if (categoryId) {
    let result = await activityService.getByCategory(categoryId);

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
  let result = await activityService.findAllByUser(userId);

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
