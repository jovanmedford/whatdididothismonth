import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { createCategory } from "../../../src/shared/creators";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";

describe("create category", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);
  let tableName = "Test-Table-123";

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
