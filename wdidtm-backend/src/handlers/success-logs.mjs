// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { Client } from "pg";
import Guard from "../shared/guard.mjs";
import SuccessLog from "../shared/success-log.mjs";

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

export const successLogsHandler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
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

  console.info("received:", event);

  const { activityLogId, day } = JSON.parse(event.body);

  if (!activityLogId || !day) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing required parameters." }),
    };
  }

  const email = event.requestContext.authorizer.claims.email;

  if (!Guard.canEditSuccessLog(email, activityLogId, client)) {
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Forbidden" }),
    };
  }

  switch (event.httpMethod) {
    case "POST": {
      let res = await SuccessLog.create(activityLogId, day, client);
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
      let res = await SuccessLog.delete(activityLogId, day, client);
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
