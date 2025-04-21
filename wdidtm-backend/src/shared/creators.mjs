import { PutCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import {
  BadInputError,
  MISSING_PROPERTIES_MESSAGE,
  NOT_ENOUGH_DAYS_MESSAGE,
} from "./errors.mjs";
import { daysLeft, generateSlug, getSlug } from "./utils.mjs";

/**
 * Creates a new  category.
 */
export const createCategory = async (input, dbClient, tableName) => {
  let category = createCategoryItem(input);
  let params = {
    TableName: tableName,
    Item: category,
    ConditionExpression: "attribute_not_exists(pk)",
  };

  await dbClient.send(new PutCommand(params));
  return category;
};

export const createCategoryItem = (input) => {
  if (!input.name || !input.color || !input.icon) {
    throw new BadInputError("You are missing required properties");
  }

  let category = {
    pk: input.pk,
    sk: `CATEGORY#${generateSlug(input.name)}`,
    color: input.color,
    icon: input.icon,
    name: input.name,
  };

  return category;
};

/**
 * Creates a new  activity.
 */
export const createActivity = async (input, dbClient, tableName) => {
  let activity = createActivityItem(input);
  let params = {
    TableName: tableName,
    Item: activity,
    ConditionExpression: "attribute_not_exists(pk)",
  };

  await dbClient.send(new PutCommand(params));

  return activity;
};

export const createActivityItem = (input) => {
  if (!input.name) {
    throw new BadInputError("You are missing required properties");
  }

  let activity = {
    pk: input.pk,
    sk: `ACTIVITY#${generateSlug(input.name)}`,
    name: input.name,
  };

  if (input.categoryId) activity.categoryId = input.categoryId;
  return activity;
};

/**
 * Creates a new log for an activity for a given period.
 */
export const createLog = async (input, dbClient, tableName) => {
  let log = createLogItem(input);

  let params = {
    TableName: tableName,
    Item: log,
    ConditionExpression: "attribute_not_exists(pk)",
  };

  await dbClient.send(new PutCommand(params));
  return log;
};

export const createLogItem = (input) => {
  if (!input || !input.activityId || !input.activityName || !input.target) {
    throw new BadInputError(MISSING_PROPERTIES_MESSAGE);
  }

  if (input.target > daysLeft()) {
    throw new BadInputError(NOT_ENOUGH_DAYS_MESSAGE);
  }

  let log = {
    pk: input.pk,
    sk: `LOG#${input.year}#${input.month}#${getSlug(input.activityId)}`,
    year: input.year,
    month: input.month,
    target: input.target,
    successes: [],
    activityId: input.activityId,
    activityName: input.activityName,
  };

  if (input.categoryId) log.categoryId = input.categoryId;

  return log
};

export const runTransactions = async (transactItems, dbClient) => {
  return await dbClient.send(
    new TransactWriteCommand({
      TransactItems: transactItems,
    })
  );
};
