import ActivityLogService from "../shared/services/activity-log";
import { Director } from "../shared/director";
import { Client } from "pg";

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
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  };

  const input = JSON.parse(event.body);

  let validatorRes = ActivityLogService.validateInput(input);
  if (!validatorRes.ok) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: validatorRes.message }),
    };
  }

  let client = await getDbClient();

  const userId = event.requestContext.authorizer.claims.sub;

  let director = new Director(client);

  if (input.activityId) {
    director.setInitialId(input.activityId);
    director.addStep({ type: "activityLog", data: input });
  } else if (input.categoryId) {
    director.setInitialId(input.categoryId);
    director.addStep({ type: "activity", data: { label: input.activityName } });
    director.addStep({ type: "activityLog", data: input });
  } else {
    director.setInitialId(userId);
    director.addStep({
      type: "category",
      data: {
        label: input.categoryName,
        icon: input.categoryIcon,
        color: input.categoryColor,
      },
    });
    director.addStep({ type: "activity", data: { label: input.activityName } });
    director.addStep({ type: "activityLog", data: input });
  }

  let exectionRes = await director.execute();

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

interface ActivityLogInput {
  year: number;
  month: number;
  target: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  activityName: string;
}
