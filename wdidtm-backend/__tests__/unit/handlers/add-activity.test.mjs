import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { addActivityHandler } from "../../../src/handlers/add-activity.mjs";
import { createPostEvent } from "../../../src/shared/utils.mjs";
import "aws-sdk-client-mock-jest";

describe("add-activity", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);
  let testEmail = "test@email.com";

  beforeEach(() => {
    ddbMock.reset();
  });

  it("should add activity with category", async () => {
    const input = { name: "Walk 10,000 steps", categoryId: 123 };

    ddbMock.on(GetCommand).resolves({
      Item: {
        pk: testEmail,
        sk: `Category#${input.categoryId}`,
        name: "Health",
      },
    });

    let event = createPostEvent(testEmail, JSON.stringify(input));

    const result = await addActivityHandler(event);

    expect(result.statusCode).toBe(200);
    expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
      TableName: process.env.WDIDTM_TABLE,
      Item: {
        pk: testEmail,
        sk: expect.stringContaining("ACTIVITY#"),
        ...input,
      },
      ConditionExpression: "attribute_not_exists(pk)",
    });
  });

  it("should add activity without category", async () => {
    const input = { name: "Walk 10,000 steps" };

    let event = createPostEvent(testEmail, JSON.stringify(input));
    const result = await addActivityHandler(event);

    expect(result.statusCode).toBe(200);
    expect(ddbMock).not.toHaveReceivedCommand(GetCommand);
    expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
      TableName: process.env.WDIDTM_TABLE,
      Item: {
        pk: testEmail,
        sk: expect.stringContaining("ACTIVITY#"),
        ...input,
      },
      ConditionExpression: "attribute_not_exists(pk)",
    });
  });

  it("should return 404 if category not found", async () => {
    const input = { name: "Activity name", categoryId: "123" };
    let event = createPostEvent(testEmail, JSON.stringify(input));

    ddbMock.on(GetCommand).resolves({
      Item: undefined,
    });

    const result = await addActivityHandler(event);

    expect(result.statusCode).toBe(404);
    expect(ddbMock).not.toHaveReceivedCommand(PutCommand);
  });

  it("should return 400 if no activity name", async () => {
    const input = { target: 10 };
    let event = createPostEvent(testEmail, JSON.stringify(input));
    const result = await addActivityHandler(event);

    expect(result.statusCode).toBe(400);
  });
});
