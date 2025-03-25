// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.WDIDTM_TABLE;

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
export const getUserActivitiesHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getUserActivities only accept GET method, you tried: ${event.httpMethod}`
    );
  }
  // All log statements are written to CloudWatch
  console.info("received:", event);

  const { year, month } = event.queryStringParameters;

  var params = {
    TableName: tableName,
    KeyConditionExpression: "userId = :userId and begins_with(#sk, :period)",
    ExpressionAttributeNames: {
      "#sk": "sk",
    },
    ExpressionAttributeValues: {
      ":userId": "123",
      ":period": `${year}#${month}`,
    },
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    var items = data.Items;
  } catch (err) {
    console.log("Console logged error --->", err);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(items),
  };

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
