import ActivityLogService from "../shared/services/activity-log";
import ActivityService from "../shared/services/activity";
import {
  BAD_REQUEST_ERROR_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
  SERVER_ERROR_MESSAGE,
} from "../shared/errors";
import { APIGatewayProxyEvent } from "aws-lambda";
import { createDbClientGetter } from "../shared/utils";
import { Client } from "pg";

let client: Client;
const getDbClient = createDbClientGetter();

export const handler = async (
  event: APIGatewayProxyEvent,
  _: any,
  __: any,
  testClient?: Client
) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  };

  if (!event.body) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: BAD_REQUEST_ERROR_MESSAGE,
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

  const input = JSON.parse(event.body);

  client = await getDbClient(testClient ?? client);
  let activityLogService = new ActivityLogService(client);
  let activityService = new ActivityService(client);

  let validatorRes = activityLogService.validateInput(input);
  if (!validatorRes.ok) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: validatorRes.message }),
    };
  }

  const userId = event.requestContext.authorizer.claims.sub;

  const activityResult = await activityService.findOrCreate({
    userId,
    label: input.label,
  });

  if (!activityResult.ok) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: SERVER_ERROR_MESSAGE,
    };
  }

  const result = await activityLogService.create({
    userId,
    year: input.year,
    month: input.month,
    target: input.target,
    activityId: activityResult.data[0]!.id,
  });

  if (!result.ok) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: SERVER_ERROR_MESSAGE,
    };
  }

  let data = result.data[0]!;

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(data),
  };
};
