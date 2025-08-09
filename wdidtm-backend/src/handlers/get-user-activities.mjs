// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { Client } from "pg";

const client = new Client({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_PROXY_ENDPOINT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
  }
});

await client.connect();

export const getUserActivitiesHandler = async (event) => {
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

  console.info("received:", event);

  const { year, month } = event.queryStringParameters;

  if (!year || !month) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing required parameters." }),
    };
  }

  const email = event.requestContext.authorizer.claims.email;
  let res;
  try {
    let text = `SELECT
    activities.id AS "activityId",
    activities.label AS "activityName",
    categories.label AS "categoryName",
    categories.color AS "categoryColor",
    categories.icon AS "categoryIcon",
    json_agg (success_logs.day) successes,
    activity_logs.target target
FROM
    users
    JOIN categories ON users.id = categories.user_ID
    JOIN activities ON categories.id = activities.cat_id
    JOIN activity_logs ON activities.id = activity_logs.activity_id
    JOIN success_logs ON activity_logs.id = success_logs.activity_log_id
WHERE
    users.email = $1 AND activity_logs.year = $2 AND activity_logs.month = $3;
GROUP BY
    categories.label,
    activities.label,
    activity_logs.year,
    activity_logs.month;`;
    res = await client.query(text, [email, year, month]);
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
    body: res,
  };

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
