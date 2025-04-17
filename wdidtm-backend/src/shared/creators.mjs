import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { BadInputError } from "./errors.mjs";
import { nanoid } from 'nanoid'

/**
 * Creates a new  category.
 */
export const createCategory = async (input, dbClient, tableName) => {
  // need to generate id

  if (!input.name || !input.color || !input.icon) {
    throw new BadInputError("You are missing required properties")
  }

  let category = {
    ...input,
    sk: `CATEGORY#${nanoid(8)}`
  }

  let params = {
    TableName: tableName,
    Item: category,
    ConditionExpression: "attribute_not_exists(pk)",
  };

  await dbClient.send(new PutCommand(params));
  return category;
};

/**
 * Creates a new  activity.
 */
export const createActivity = (activity, dbClient, tableName) => {};

/**
 * Creates a new log for an activity for a given period.
 */
export const createProgressItem = (period, activity, dbClient, tableName) => {};
