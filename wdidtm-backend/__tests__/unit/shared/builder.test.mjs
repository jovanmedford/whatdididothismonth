import { Builder } from "../../../src/shared/builder.mjs";
import { jest } from "@jest/globals";

describe("builder", () => {
  it("executes in order", async () => {
    const userId = "user-1";
    const categoryId = "cat-1";
    const activityId = "act-1";
    const activityLogId = "log-1";
    const mockClient = {
      query: jest
        .fn()
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({ rows: [{ id: categoryId }] })
        .mockResolvedValueOnce({ rows: [{ id: activityId }] })
        .mockResolvedValueOnce({ rows: [{ id: activityLogId }] })
        .mockResolvedValueOnce({}),
    };

    let builder = new Builder(mockClient);
    builder.setInitialId(userId);
    builder.addStep({
      type: "category",
      data: {
        label: "finance",
        color: "purple",
        icon: "money",
      },
    });
    builder.addStep({
      type: "activity",
      data: { label: "Check account" },
    });
    builder.addStep({
      type: "activityLog",
      data: { year: 2020, month: 4, day: 10, target: 10 },
    });

    const res = await builder.execute();

    if (!res.ok) {
      console.error(res.message);
      throw Error(res.message);
    }

    expect(mockClient.query).toHaveBeenNthCalledWith(1, `BEGIN;`);

    expect(mockClient.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(`INSERT INTO categories`),
      ["user-1", "finance", "money", "purple"]
    );
    expect(mockClient.query).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining(`INSERT INTO activities`),
      ["cat-1", "Check account"]
    );

    expect(mockClient.query).toHaveBeenNthCalledWith(
      4,
      expect.stringContaining(`INSERT INTO activity-logs`),
      ["act-1", 2020, 4, 10, 10]
    );
  });

  it("rolls back on error", async () => {
    const userId = "user-1";
    const categoryId = "cat-1";
    const activityId = "act-1";
    const activityLogId = "log-1";
    const mockClient = {
      query: jest
        .fn()
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({ rows: [{ id: categoryId }] })
        .mockRejectedValue("No activity exists for this id.")
        .mockResolvedValueOnce({ rows: [{ id: activityLogId }] })
        .mockResolvedValueOnce({}),
    };

    let builder = new Builder(mockClient);
    builder.setInitialId(userId);
    builder.addStep({
      type: "category",
      data: {
        label: "finance",
        color: "purple",
        icon: "money",
      },
    });
    builder.addStep({
      type: "activity",
      data: { label: "Check account" },
    });
    builder.addStep({
      type: "activityLog",
      data: { year: 2020, month: 4, day: 10, target: 10 },
    });

    const res = await builder.execute();

    if (!res.ok) {
      console.error(res.message);
      throw Error(res.message);
    }

    expect(mockClient.query).toHaveBeenNthCalledWith(1, `BEGIN;`);

    expect(mockClient.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(`INSERT INTO categories`),
      ["user-1", "finance", "money", "purple"]
    );
    expect(mockClient.query).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining(`INSERT INTO activities`),
      ["cat-1", "Check account"]
    );

    expect(mockClient.query).toHaveBeenNthCalledWith(
      4,
      expect.stringContaining(`INSERT INTO activity-logs`),
      ["act-1", 2020, 4, 10, 10]
    );
  });
});
