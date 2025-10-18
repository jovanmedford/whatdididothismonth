import { Client } from "pg";
import {
  createDbClientGetter,
  expectToBeTruthy,
} from "../../../src/shared/utils";
import ActivityLogService from "../../../src/shared/services/activity-log";
import { ALICE, ALICE_ACTIVITY_LOGS } from "../seed-data";

let client: Client;
let getDbClient = createDbClientGetter();

describe("getByDate", () => {
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
    const activityLogService = new ActivityLogService(client);
    const input = {
      year: 2025,
      month: 10,
      userId: ALICE.id,
    };

    const result = await activityLogService.getByDate(input);

    expectToBeTruthy(result.ok);
    expect(result.data).toEqual(ALICE_ACTIVITY_LOGS);
  });
});
