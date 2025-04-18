import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { createCategory, createActivity } from "../../../src/shared/creators";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";

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
  it("successfully creates an activity", () => {
    let input = {
      pk: "test@example.com",
      name: "Tennis",
      categoryId: "123",
      description: "Favorite sport",
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
