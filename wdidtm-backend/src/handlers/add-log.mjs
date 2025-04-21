import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import {
  createActivityItem,
  createCategoryItem,
  createLogItem,
  runTransactions,
} from "../shared/creators.mjs";
import { getOneActivity } from "../shared/getters.mjs";
import { BadInputError } from "../shared/errors.mjs";
import { generateSlug } from "../shared/utils.mjs";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const addLogHandler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  };

  const input = JSON.parse(event.body);

  if (
    !input ||
    !input.target ||
    !input.year ||
    !input.month ||
    !input.activityStatus ||
    !input.categoryStatus
  ) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing log fields" }),
    };
  }

  const email = event.requestContext.authorizer.claims.email;

  let log = {
    pk: email,
    year: input.year,
    month: input.month,
    target: input.target,
  };

  let transactionItems = [];

  try {
    if (input.categoryStatus == "existing") {
      if (!input.categoryId) {
        throw new BadInputError(
          "Category status is 'existing' but no category id provided"
        );
      }

      log = { ...log, categoryId: input.categoryId };
    }

    if (input.categoryStatus == "new") {
      const categoryInput = {
        pk: email,
        name: input.categoryName,
        icon: input.categoryIcon,
        color: input.categoryColor
      };

    const newCategory = createCategoryItem(categoryInput)

      transactionItems.push({
        Put: {
          TableName: process.env.WDIDTM_TABLE,
          Item: newCategory,
          ConditionExpression: "attribute_not_exists(pk)",
        },
      });
      log = { ...log, categoryId: newCategory.sk };
    }

    if (input.activityStatus == "existing") {
      const activity = await getOneActivity(
        input,
        ddbDocClient,
        process.env.WDIDTM_TABLE
      );

      if (!activity || !activity.Item) {
        throw new NotFoundError("Activity was not found");
      }

      log = {
        ...log,
        activityId: input.activityId,
        activityName: activity.Item.name,
      };
    }

    if (input.activityStatus == "new") {
      const activityInput = {
        pk: email,
        name: input.activityName,
      };

      const newActivity = createActivityItem(activityInput);

      transactionItems.push({
        Put: {
          TableName: process.env.WDIDTM_TABLE,
          Item: newActivity,
          ConditionExpression: "attribute_not_exists(pk)",
        },
      });

      log = {
        ...log,
        activityId: newActivity.sk,
        activityName: newActivity.name,
      };
    }

    let newLog = createLogItem(log)

    transactionItems.push({
      Put: {
        TableName: process.env.WDIDTM_TABLE,
        Item: newLog,
        ConditionExpression: "attribute_not_exists(pk)",
      },
    });

    await runTransactions(transactionItems, ddbDocClient);
    console.log("Success - added new log", newLog);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(newLog),
    };
  } catch (e) {
    console.log(e);
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
