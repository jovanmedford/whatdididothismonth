import { SYSTEM_USER_ID } from "../shared/constants";
import { FORBIDDEN_ERROR_MESSAGE } from "../shared/errors";
import { createDbClientGetter } from "../shared/utils";
import { APIGatewayProxyEvent } from "aws-lambda";

const getDbClient = createDbClientGetter();

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

  const { year, month } = event.queryStringParameters;

  if (!year || !month) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing required parameters." }),
    };
  }

  let client = await getDbClient();

  const userId = event.requestContext.authorizer.claims.sub;
  let res;
  try {
    let text = `SELECT
    activity_logs.id AS "id",
    activities.id AS "activityId",
    activities.label AS "activityName",
    categories.label AS "categoryName",
    categories.color AS "categoryColor",
    categories.icon AS "categoryIcon",
    COALESCE(
    json_agg(success_logs.day) FILTER (WHERE success_logs.day IS NOT NULL),
    '[]'::json
    ) AS successes,
    activity_logs.target target
FROM
    users
    JOIN categories ON users.id = categories.user_id
    JOIN activities ON categories.id = activities.cat_id
    JOIN activity_logs ON activities.id = activity_logs.activity_id
    LEFT JOIN success_logs ON activity_logs.id = success_logs.activity_log_id
WHERE
    (users.id = $1 OR categories.user_id = $2) AND activity_logs.year = $3 AND activity_logs.month = $4
GROUP BY
    activity_logs.id,
    activities.id,
    activities.label,
    categories.label,
    categories.color,
    categories.icon,
    activity_logs.target;`;
    res = await client.query(text, [userId, SYSTEM_USER_ID, year, month]);
  } catch (err) {
    console.log("Console logged error --->", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal Server Error." }),
    };
  }

  const response = {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(res.rows),
  };

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
