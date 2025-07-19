import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { BadInputError, MISSING_PROPERTIES_MESSAGE } from "./errors.mjs";
import { QueryCommand } from "@aws-sdk/client-dynamodb";

export const getOneCategory = async (input, dbClient, tableName) => {
  if (!input.id || !input.pk) {
    throw new BadInputError("No category id provided");
  }

  let params = {
    TableName: tableName,
    Key: {
      pk: input.pk,
      sk: `CATEGORY#${input.id}`,
    },
  };

  const data = await dbClient.send(new GetCommand(params));

  console.log(data);
  return data;
};

export const getOneActivity = async (input, dbClient, tableName) => {
  if (!input || !input.activityId) {
    throw new BadInputError("No activity id provided");
  }

  let params = {
    TableName: tableName,
    Key: {
      pk: input.pk,
      sk: `ACTIVITY#${input.activityId}`,
    },
  };

  const data = await dbClient.send(new GetCommand(params));

  return data;
};

export const getAllCategories = async (input, dbClient, tableName) => {
  if (!input.pk) {
    throw new BadInputError(MISSING_PROPERTIES_MESSAGE);
  }

  let params = {
    TableName: tableName,
    KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
    ExpressionAttributeValue: {
      ":pk": input.pk,
      ":sk": "CATEGORY#",
    },
  };

  const data = await dbClient.send(new QueryCommand(params));

  return data;
};

export const getAllActivities = async (input, dbClient, tableName) => {
  if (!input.pk) {
    throw new BadInputError(MISSING_PROPERTIES_MESSAGE);
  }

  let params = {
    TableName: tableName,
    KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
    ExpressionAttributeValue: {
      ":pk": input.pk,
      ":sk": "ACTIVITY#",
    },
  };

  const data = await dbClient.send(new QueryCommand(params));

  return data;
};
