import { Client } from "pg";
import { ActivityLog, ActivityLogInput, Service } from "../types";
import { executeQuery, createInputValidator } from "../utils";

const ActivityLogService: Service<ActivityLog, ActivityLogInput> = {
  async create(dbClient: Client, { year, month, target }, activityId: string) {
    return await executeQuery(
      dbClient,
      `INSERT INTO activity_logs (activity_id, year, month, target) VALUES ($1, $2, $3, $4) RETURNING id;`,
      [activityId, year, month, target]
    );
  },

  validateInput(input) {
    let validator = createInputValidator(["year", "month", "target"]);
    return validator(input);
  },
};

export default ActivityLogService;
