import ActivityService from "../../../src/shared/services/activity";
import { Activity, Category } from "../../../src/shared/types";
import { findQuery, createQuery } from "../../../src/shared/services/activity";
import { expectToBeTruthy } from "../../../src/shared/utils";

describe("find or create activity", () => {
  it("returns activity if found", async () => {
    const activity: Activity = {
      id: "activity-1",
      categoryId: "category-1",
      label: "Running",
    };
    const input = { label: "Running", userId: "1101" };
    const mockClient = {
      query: jest.fn().mockResolvedValueOnce({ rows: [{ ...activity }] }),
    };
    const activityService = new ActivityService(mockClient);
    let foundResult = await activityService.findOrCreate(input);

    expectToBeTruthy(foundResult.ok);
    expectToBeTruthy(foundResult.data.length > 0);
    expect(foundResult.data[0]).toEqual(activity);
    expect(mockClient.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(findQuery),
      [input.userId, input.label]
    );
  });

  it("creates a new activity if not found", async () => {
    const activity: Activity = {
      id: "activity-23",
      categoryId: "category-1",
      label: "Jumping",
    };

    const uncategorized: Category = {
      id: "100",
      userId: "system",
      label: "Uncategorized",
      color: "green",
      icon: "qeustion",
    };

    const input = { label: "Jumping", userId: "1101" };
    const mockClient = {
      query: jest
        .fn()
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ ...uncategorized }] })
        .mockResolvedValueOnce({ rows: [{ ...activity }] }),
    };

    const activityService = new ActivityService(mockClient);
    let foundResult = await activityService.findOrCreate(input);
    expectToBeTruthy(foundResult.ok);
    expect(foundResult.data.length).toBe(1);
    expect(foundResult.data[0]).toEqual(activity);
    expect(mockClient.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(findQuery),
      [input.userId, input.label]
    );
    expect(mockClient.query).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining(createQuery),
      [uncategorized.id, input.label]
    );
  });
});
