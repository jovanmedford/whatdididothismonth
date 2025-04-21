import {
  DynamoDBDocumentClient,
  GetCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";
import { addLogHandler } from "../../../src/handlers/add-log.mjs";
import { createPostEvent, getSlug } from "../../../src/shared/utils.mjs";
import {
  createActivityItem,
  createCategoryItem,
  createLogItem,
} from "../../../src/shared/creators.mjs";

let ddbMock = mockClient(DynamoDBDocumentClient);

describe("add-log", () => {
  let testEmail = "test@email.com";
  beforeEach(() => {
    ddbMock.reset();
  });

  it("should add log - existing activity - uncategorized", async () => {
    let activity = { pk: testEmail, sk: "ACTIVITY#tennis", name: "Tennis" };

    let input = {
      year: 2025,
      month: 4,
      activityId: "tennis",
      activityStatus: "existing",
      categoryStatus: "uncategorized",
      target: 10,
    };

    ddbMock.on(GetCommand).resolves({
      Item: activity,
    });

    let event = createPostEvent(testEmail, JSON.stringify(input));
    let result = await addLogHandler(event);

    expect(result.statusCode).toBe(200);
    expect(ddbMock).toHaveReceivedCommandWith(TransactWriteCommand, {
      TransactItems: [
        {
          Put: {
            TableName: process.env.WDIDTM_TABLE,
            Item: {
              pk: testEmail,
              sk: expect.stringContaining(`LOG#${input.year}#${input.month}#`),
              activityId: input.activityId,
              activityName: activity.name,
              successes: [],
              target: input.target,
              year: input.year,
              month: input.month,
            },
            ConditionExpression: "attribute_not_exists(pk)",
          },
        },
      ],
    });
  });

  it("should add log - existing activity - existing category", async () => {
    let activity = {
      pk: testEmail,
      sk: "ACTIVITY#cricket",
      name: "Cricket",
      categoryId: "CATEGORY#health",
    };

    let input = {
      year: 2025,
      month: 4,
      target: 10,
      activityStatus: "existing",
      categoryStatus: "existing",
      activityId: "ACTIVITY#cricket",
      categoryId: "CATEGORY#health",
    };

    ddbMock.on(GetCommand).resolves({
      Item: activity,
    });

    let event = createPostEvent(testEmail, JSON.stringify(input));

    let result = await addLogHandler(event);

    expect(result.statusCode).toBe(200);
    expect(ddbMock).toHaveReceivedCommandWith(TransactWriteCommand, {
      TransactItems: [
        {
          Put: {
            TableName: process.env.WDIDTM_TABLE,
            Item: {
              pk: testEmail,
              sk: expect.stringContaining(
                `LOG#${input.year}#${input.month}#${getSlug(activity.sk)}`
              ),
              activityId: input.activityId,
              activityName: activity.name,
              categoryId: input.categoryId,
              successes: [],
              target: input.target,
              year: input.year,
              month: input.month,
            },
            ConditionExpression: "attribute_not_exists(pk)",
          },
        },
      ],
    });
  });

  it("should add log - new activity - existing category", async () => {
    const activity = {
      pk: testEmail,
      sk: "ACTIVITY#10-000-steps-a-day",
      name: "10,000 steps a day",
    };

    const category = {
      pk: testEmail,
      sk: "CATEGORY#fitness",
      name: "Fitness",
      icon: "weights.svg",
      color: "green",
    };

    const input = {
      year: 2025,
      month: 6,
      target: 1,
      activityStatus: "new",
      categoryStatus: "existing",
      activityName: activity.name,
      categoryId: category.sk,
    };

    let expectedLog = {
      pk: testEmail,
      sk: `LOG#${input.year}#${input.month}#${getSlug(activity.sk)}`,
      year: input.year,
      month: input.month,
      target: input.target,
      successes: [],
      activityId: activity.sk,
      activityName: activity.name,
      categoryId: category.sk,
    };

    const event = createPostEvent(testEmail, JSON.stringify(input));

    const result = await addLogHandler(event);

    expect(result.statusCode).toBe(200);
    expect(ddbMock).toHaveReceivedCommandWith(TransactWriteCommand, {
      TransactItems: [
        {
          Put: {
            TableName: process.env.WDIDTM_TABLE,
            Item: createActivityItem(activity),
            ConditionExpression: "attribute_not_exists(pk)",
          },
        },
        {
          Put: {
            TableName: process.env.WDIDTM_TABLE,
            Item: createLogItem(expectedLog),
            ConditionExpression: "attribute_not_exists(pk)",
          },
        },
      ],
    });
  });

  it("should add log - new activity - new category", async () => {
    let input = {
      year: 2025,
      month: 4,
      target: 10,
      activityStatus: "new",
      categoryStatus: "new",
      activityName: "Cricket",
      categoryName: "Sports",
      categoryIcon: "test.svg",
      categoryColor: "#0A3FC1",
    };

    let expectedCategory = {
      pk: testEmail,
      sk: "CATEGORY#sports",
      name: input.categoryName,
      icon: input.categoryIcon,
      color: input.categoryColor,
    };

    let expectedActivity = {
      pk: testEmail,
      sk: "ACTIVITY#cricket",
      name: "Cricket"
    };


    let expectedLog = {
      pk: testEmail,
      sk: `LOG#${input.year}#${input.month}#${getSlug(expectedActivity.sk)}`,
      year: input.year,
      month: input.month,
      target: input.target,
      successes: [],
      categoryId: expectedCategory.sk,
      activityId: expectedActivity.sk,
      activityName: expectedActivity.name
    };



    let event = createPostEvent(testEmail, JSON.stringify(input));

    const result = await addLogHandler(event);

    let transactItems = [
      () => createCategoryItem(expectedCategory),
      () => createActivityItem(expectedActivity),
      () => createLogItem(expectedLog),
    ].map((fn) => ({
      Put: {
        TableName: process.env.WDIDTM_TABLE,
        Item: fn(),
        ConditionExpression: "attribute_not_exists(pk)",
      },
    }));

    expect(result.statusCode).toBe(200);
    expect(ddbMock).toHaveReceivedCommandWith(TransactWriteCommand, {
      TransactItems: transactItems,
    });
  });

  it.todo(
    "should 400 error - existing activity & category - but no categoryId provided"
  );
});
