import ActivityLog from "../shared/activity-log.mjs";
import { Builder } from "../shared/builder.mjs";
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

export const handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  };

  const input = JSON.parse(event.body);

  let validatorRes = ActivityLog.validateInput(input);
  if (!validatorRes.ok) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: validatorRes.message }),
    };
  }

  const userId = event.requestContext.authorizer.claims.sub;

  let builder = new Builder(client);

  if (input.activityId) {
    builder.setInitialId(input.activityId);
    builder.addStep({ type: "activityLog", data: input });
  } else if (input.categoryId) {
    builder.setInitialId(input.categoryId);
    builder.addStep({ type: "activity", data: {label: input.activityName} });
    builder.addStep({ type: "activityLog", data: input });
  } else {
    builder.setInitialId(userId);
    builder.addStep({ type: "category", data: { label: input.categoryName, icon: input.categoryIcon, color: input.categoryColor } });
    builder.addStep({ type: "activity", data: {label: input.activityName} });
    builder.addStep({ type: "activityLog", data: input });
  }

  let exectionRes = await builder.execute();

  if (!exectionRes.ok) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify(exectionRes.message),
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(exectionRes.data),
  };
};
