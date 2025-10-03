import { Client } from "pg";
import Guard from "../shared/guard.mjs";
import SuccessLog from "../shared/services/success-log";

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
    "Access-Control-Allow-Methods": "POST,DELETE,OPTIONS",
  };

  if (event.httpMethod !== "POST" && event.httpMethod !== "DELETE") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed." }),
    };
  }

  if (event.body === null) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing required parameters." }),
    };
  }

  let client = await getDbClient();

  console.info("received:", event);

  const { activityLogId, day } = JSON.parse(event.body);

  if (!activityLogId || !day) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing required parameters." }),
    };
  }

  const userId = event.requestContext.authorizer.claims.sub;

  if (!Guard.canEditActivityLog(userId, activityLogId, client)) {
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Forbidden" }),
    };
  }

  switch (event.httpMethod) {
    case "POST": {
      let res = await SuccessLog.create(client, { day }, activityLogId);
      if (res.ok) {
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ activityId: res.data }),
        };
      }
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
    case "DELETE": {
      let res = await SuccessLog.delete!(client, { day }, activityLogId);
      if (res.ok) {
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: "success",
        };
      }
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  }
};
