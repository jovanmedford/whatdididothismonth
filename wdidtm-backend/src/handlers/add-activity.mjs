import { createActivity } from "../shared/creators.mjs";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { getOneCategory } from "../shared/getters.mjs";
import { NotFoundError } from "../shared/errors.mjs";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const addActivityHandler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  };

  const input = JSON.parse(event.body);

  if (!input || !input.name) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing category fields" }),
    };
  }

  const email = event.requestContext.authorizer.claims.email;

  try {
    if (input.categoryId) {
      let category = await getOneCategory(
        { pk: email, id: input.categoryId },
        ddbDocClient,
        process.env.WDIDTM_TABLE
      );
      if (!category || !category.Item) {
        throw new NotFoundError("Category was not found");
      }
    }

    let activity = {
      pk: email,
      ...input,
    };

    let data = await createActivity(
      activity,
      ddbDocClient,
      process.env.WDIDTM_TABLE
    );
    console.log("Success - added new activity", data);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data),
    };
  } catch (e) {
    console.log(e)
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

    if (e.name == "NotFoundError") {
      return {
        statusCode: 404,
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
