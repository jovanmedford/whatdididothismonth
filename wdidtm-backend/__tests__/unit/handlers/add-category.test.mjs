import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { addCategoryHandler } from "../../../src/handlers/add-category.mjs";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { expect } from "@jest/globals";
import "aws-sdk-client-mock-jest";

const createPostEvent = (email, body) => {
  return {
    httpMethod: "POST",
    requestContext: {
      authorizer: {
        claims: {
          email,
        },
      },
    },
    body,
  };
};

describe("add-category", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);
  const testEmail = "test@email.com";

  beforeEach(() => {
    ddbMock.reset();
  });

  it("should add category", async () => {
    let input = {
      name: "Health",
      color: "#008000",
      icon: "hat.svg",
    };

    const event = createPostEvent(testEmail, JSON.stringify(input));
    const result = await addCategoryHandler(event);

    expect(result.statusCode).toBe(200);
    expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
      TableName: process.env.WDIDTM_TABLE,
      Item: {
        pk: testEmail,
        sk: expect.stringContaining("CATEGORY#"),
        ...input
      },
      ConditionExpression: "attribute_not_exists(pk)",
    });
  });

  it("should return 409 if a condition check fails", async () => {
    const category = {
      name: "Duplicated Item",
      color: "#0A4000",
      icon: "money.svg",
    };

    const event = createPostEvent(testEmail, JSON.stringify(category));

    ddbMock
      .on(PutCommand)
      .rejects(new ConditionalCheckFailedException("Duplicate item"));

    const result = await addCategoryHandler(event);

    expect(result.statusCode).toBe(409);
  });

  it("should return 400 if missing category attributes", async () => {
    const category = { name: "Running" };
    const event = createPostEvent(testEmail, JSON.stringify(category));

    const result = await addCategoryHandler(event);

    expect(result.statusCode).toBe(400);
  });

  it("should return 500 if unknown error", async () => {
    const category = {
      name: "Unknown Item Error",
      color: "#0A4000",
      icon: "money.svg",
    };

    const event = createPostEvent(testEmail, JSON.stringify(category));

    ddbMock.on(PutCommand).rejects(new Error("Unknown Error"));

    const result = await addCategoryHandler(event);

    expect(result.statusCode).toBe(500);
  });
});
