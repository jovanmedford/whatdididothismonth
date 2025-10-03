import { Client } from "pg";
import { getDbClient } from "../shared/utils";
import { APIGatewayProxyEvent } from "aws-lambda";
import Guard from "../shared/guard.mjs";
import ActivityLogService from "../shared/services/activity-log";

let client: Client | undefined;

export const handler = async (event: APIGatewayProxyEvent) => {
  client = await getDbClient(client);

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
  };

  if (!event.requestContext.authorizer) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Forbidden resource.",
      }),
    };
  }

  const userId = event.requestContext.authorizer.claims.sub;
  const { ids } = event.queryStringParameters as { ids: string };
  const idList = ids.split(",").filter((id) => Boolean(id));

  if (idList.some((id) => !Guard.canEditActivityLog(userId, id, client))) {
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({
        error:
          "Forbidden - you do not own all of the activity logs selected for deletion.",
      }),
    };
  }

  console.info("received:", event);

  if (!ids) {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({
        error:
          "You need to specify the id's of the activity logs you wish to delete.",
      }),
    };
  }

  let successIds = [];
  let failures = [];

  for (let id of idList) {
    let res = await ActivityLogService.delete!(client, id);
    if (!res.ok) {
      failures.push({ id, message: res.message });
      continue;
    }
    successIds.push(id);
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: successIds,
      failures,
    }),
  };
};
