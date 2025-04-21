import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  createCategory,
  createActivity,
  createLog,
} from "../../../src/shared/creators";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";
import { MISSING_PROPERTIES_MESSAGE, NOT_ENOUGH_DAYS_MESSAGE } from "../../../src/shared/errors.mjs";

const ddbMock = mockClient(DynamoDBDocumentClient);
let tableName = "Test-Table-123";

describe("create category", () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  it("successfully creates a category", () => {
    let input = {
      pk: "test@example.com",
      name: "Health",
      color: "#008000",
      icon: "hat.svg",
    };

    createCategory(input, ddbMock, tableName);

    expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
      TableName: tableName,
      Item: {
        pk: "test@example.com",
        sk: expect.stringContaining("CATEGORY#"),
        ...input,
      },
      ConditionExpression: "attribute_not_exists(pk)",
    });
  });

  it("throws an error if any category field is missing", async () => {
    let category = { name: "Health", color: "#008000" };

    await expect(createCategory(category, ddbMock, tableName)).rejects.toThrow(
      "missing required properties"
    );
  });
});

describe("create activity", () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  it("successfully creates an activity", () => {
    let input = {
      pk: "test@example.com",
      name: "Tennis",
      categoryId: "123",
    };

    createActivity(input, ddbMock, tableName);

    expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
      TableName: tableName,
      Item: {
        pk: "test@example.com",
        sk: expect.stringContaining("ACTIVITY#"),
        ...input,
      },
      ConditionExpression: "attribute_not_exists(pk)",
    });
  });

  it("throws an error if name is missing", async () => {
    let category = { category: "no name", description: "Without a name" };

    await expect(createActivity(category, ddbMock, tableName)).rejects.toThrow(
      "missing required properties"
    );
  });
});

describe("create log", () => {
  let testEmail = "test@email.com";
  beforeEach(() => {
    ddbMock.reset();
  });

  it("successfully adds a new log", async () => {
    let input = {
      pk: testEmail,
      year: 2025,
      month: 4,
      activityId: "tennis",
      activityName: "Tennis",
      categoryId: "health",
      target: 10,
      successes: []
    };

    await createLog(input, ddbMock, tableName);

    expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
      TableName: tableName,
      Item: {
        pk: testEmail,
        sk: expect.stringContaining(
          `LOG#${input.year}#${input.month}#${input.activityId}`
        ),
        ...input,
      },
      ConditionExpression: "attribute_not_exists(pk)",
    });
  });

  it("throw error if activityId is missing", async () => {
    let input = {
      pk: testEmail,
      year: 2025,
      month: 4,
      target: 10,
    };

    await expect(createLog(input, ddbMock, tableName)).rejects.toThrow(
      MISSING_PROPERTIES_MESSAGE
    );
  });

  it("throw error if target is missing", async () => {
    let input = {
      pk: testEmail,
      year: 2025,
      month: 4,
      activityId: "tennis",
      activityName: "Tennis",
    };

    await expect(createLog(input, ddbMock, tableName)).rejects.toThrow(
      MISSING_PROPERTIES_MESSAGE
    );
  });

  it("throw error if target is bigger than days remaining", async () => {
    let input = {
      pk: testEmail,
      year: 2025,
      month: 4,
      target: 60,
      activityId: "tennis",
      activityName: "Tennis",
    };

    await expect(createLog(input, ddbMock, tableName)).rejects.toThrow(
      NOT_ENOUGH_DAYS_MESSAGE
    );
  });
});
