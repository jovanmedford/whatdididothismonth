import { Client } from "pg";
import {
  createDbClientGetter,
  createGetTestEvent,
} from "../../../src/shared/utils";
import { ALICE, ALICE_ACTIVITY_LOGS } from "../seed-data";
import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import { handler } from "../../../src/handlers/activity-logs-get";

let client: Client;
let getDbClient = createDbClientGetter();

describe("/GET activity-logs", () => {
  beforeAll(async () => {
    client = await getDbClient();
  });

  afterAll(async () => {
    await client.end();
  });

  beforeEach(async () => {
    await client.query("BEGIN;");
  });

  afterEach(async () => {
    await client.query("ROLLBACK;");
  });

  it("Should get the logs for alice", async () => {
    let queryParams: APIGatewayProxyEventQueryStringParameters = {
      year: "2025",
      month: "10",
    };

    const event = createGetTestEvent({ queryParams, userId: ALICE.id });
    const response = await handler(event, null, null, client);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(ALICE_ACTIVITY_LOGS);
  });
});
