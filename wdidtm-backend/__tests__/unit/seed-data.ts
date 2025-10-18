import { Activity, ActivityLogResult, User } from "../../src/shared/types";

export const ALICE: User = {
  id: "11111111-1111-1111-1111-111111111111",
  email: "alice@example.com",
};

export const ALICE_HEALTH_JOG: Activity = {
  id: "11111111-aaaa-cccc-aaaa-111111111111",
  categoryId: "11111111-aaaa-aaaa-aaaa-111111111111",
  label: "Morning Jog",
};

// 2025, 10
export const ALICE_ACTIVITY_LOGS: ActivityLogResult[] = [
  {
    activityId: "11111111-aaaa-cccc-aaaa-111111111111",
    activityName: "Morning Jog",
    categoryName: "Health",
    categoryColor: "#34D399",
    categoryIcon: "heart",
    successes: [1, 2, 4],
    id: "11111111-aaaa-dddd-aaaa-111111111111",
    target: 20,
  },
  {
    activityId: "11111111-bbbb-cccc-bbbb-111111111111",
    activityName: "Read a Book",
    categoryName: "Learning",
    categoryColor: "#60A5FA",
    categoryIcon: "book",
    successes: [3, 5],
    id: "11111111-bbbb-dddd-bbbb-111111111111",
    target: 15,
  },
];
