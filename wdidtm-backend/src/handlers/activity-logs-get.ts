import { Client } from "pg";
import { FORBIDDEN_ERROR_MESSAGE } from "../shared/errors";
import ActivityLogService from "../shared/services/activity-log";
import { createDbClientGetter } from "../shared/utils";
import { APIGatewayProxyEvent } from "aws-lambda";

let client: Client;
let getDbClient = createDbClientGetter();

export const handler = async (
  event: APIGatewayProxyEvent,
  context: any,
  callback: any,
  testClient: Client
) => {
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

  if (event.queryStringParameters === null) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing required parameters." }),
    };
  }

  if (!event.requestContext.authorizer) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({
        error: FORBIDDEN_ERROR_MESSAGE,
      }),
    };
  }

  console.info("received:", event);
  console.info("Client", testClient)

  const { year, month } = event.queryStringParameters;

  if (isNaN(Number(year)) || isNaN(Number(month))) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing required parameters." }),
    };
  }

  client = await getDbClient(testClient ?? client);
  const activityLogService = new ActivityLogService(client);

  const userId = event.requestContext.authorizer.claims.sub;

  const result = await activityLogService.getByDate({
    year: Number(year),
    month: Number(month),
    userId,
  });

  if (!result.ok) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal Server Error." }),
    };
  }

  const response = {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(result.data),
  };

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
