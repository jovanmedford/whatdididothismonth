import { createCategory } from "../shared/creators.mjs";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);



export const addCategoryHandler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  };

  const input = JSON.parse(event.body);

  if (!input || !input.name || !input.color || !input.icon) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing category fields" }),
    };
  }

  const email = event.requestContext.authorizer.claims.email;

  let category = {
    pk: email,
    ...input
  }

  try {
    let data = await createCategory(category, ddbDocClient, process.env.WDIDTM_TABLE);
    console.log("Success - added new category", data);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data),
    };
  } catch (e) {
    if (e.name == "BadInputError") {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: e.message }),
      };
    }

    if (e.name == "ConditionalCheckFailedException") {
      return {
        statusCode: 409,
        headers: corsHeaders,
        body: JSON.stringify({ error: e.message }),
      };
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
