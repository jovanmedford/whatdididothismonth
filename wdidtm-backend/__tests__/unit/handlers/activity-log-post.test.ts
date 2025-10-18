import { handler } from "../../../src/handlers/activity-logs-post";
import {
  createDbClientGetter,
  createPostTestEvent,
} from "../../../src/shared/utils";
import { Client } from "pg";
import { ALICE, ALICE_HEALTH_JOG } from "../seed-data";
import { ActivityLog } from "../../../src/shared/types";

const getDbClient = createDbClientGetter();
let client: Client;

describe("Creating activity logs", () => {
  beforeAll(async () => {
    client = await getDbClient(client);
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

  it("creates from existing activity", async () => {
    const input = {
      label: ALICE_HEALTH_JOG.label,
      year: 2025,
      month: 3,
      target: 10,
    };

    const event = createPostTestEvent({
      userId: ALICE.id,
      body: JSON.stringify(input),
    });

    const response = await handler(event, client);

    expect(response.statusCode).toBe(200);
    const result = JSON.parse(response.body) as ActivityLog;
    expect(result.activityId).toEqual(ALICE_HEALTH_JOG.id);
  });

  it("creates from new activity", async () => {
    const input = {
      label: "Outside",
      year: 2025,
      month: 5,
      target: 10,
    };

    const event = createPostTestEvent({
      userId: ALICE.id,
      body: JSON.stringify(input),
    });

    const response = await handler(event, client);

    expect(response.statusCode).toBe(200);
    const result = JSON.parse(response.body) as ActivityLog;
    expect(result.activityId).toBeDefined();
  });
});
