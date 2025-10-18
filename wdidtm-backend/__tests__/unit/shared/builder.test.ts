import { Director } from "../../../src/shared/director";

describe("director", () => {
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

    let director = new Director(mockClient);
    director.setInitialId(userId);
    director.addStep({
      type: "category",
      data: {
        label: "finance",
        color: "purple",
        icon: "money",
      },
    });
    director.addStep({
      type: "activity",
      data: { label: "Check account" },
    });
    director.addStep({
      type: "activityLog",
      data: { year: 2020, month: 4, day: 10, target: 10 },
    });

    const res = await director.execute();

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
      expect.stringContaining(`INSERT INTO activity_logs`),
      ["act-1", 2020, 4, 10]
    );
  });
});
