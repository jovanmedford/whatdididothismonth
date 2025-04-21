import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { BadInputError } from "./errors.mjs";

export const getOneCategory = async (input, dbClient, tableName) => {
  if (!input.id || !input.pk) {
    throw new BadInputError("No category id provided");
  }

  let params = {
    TableName: tableName,
    Key: {
      pk: input.pk,
      sk: `CATEGORY#${input.id}`
    }
  };

  const data = await dbClient.send(new GetCommand(params));

  console.log(data)
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
      sk: `ACTIVITY#${input.activityId}`
    }
  };

  const data = await dbClient.send(new GetCommand(params));

  return data;
};
