// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.WDIDTM_TABLE;

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

  var params = {
    TableName: tableName,
    KeyConditionExpression: "pk = :pk and begins_with(#sk, :period)",
    ExpressionAttributeNames: {
      "#sk": "sk",
    },
    ExpressionAttributeValues: {
      ":pk": `${email}`,
      ":period": `PROGRESS#${year}#${month}`,
    },
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    var items = data.Items;
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
    body: JSON.stringify(items),
  };

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
