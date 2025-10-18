import { Client } from "pg";
import { ActivityLog, ActivityLogInput, Service } from "../types";
import { executeQuery, createInputValidator } from "../utils";

export class ActivityLogService
  implements Service<ActivityLog, ActivityLogInput>
{
  constructor(private dbClient: Client) {}

  async create(input: ActivityLogInput) {
    return await executeQuery<ActivityLog>(
      this.dbClient,
      `INSERT INTO activity_logs (activity_id, year, month, target) VALUES ($1, $2, $3, $4) RETURNING activity_id, year, month, target;`,
      [input.activityId, input.year, input.month, input.target]
    );
  }

  async builderCreate(
    { year, month, target }: Omit<ActivityLogInput, "activityId">,
    activityId: string
  ) {
    return await executeQuery(
      this.dbClient,
      `INSERT INTO activity_logs (activity_id, year, month, target) VALUES ($1, $2, $3, $4) RETURNING id;`,
      [activityId, year, month, target]
    );
  }

  validateInput(input: ActivityLogInput) {
    let validator = createInputValidator(["year", "month", "target"]);
    return validator(input);
  }

  async delete(id: string) {
    return await executeQuery<string>(
      this.dbClient,
      `DELETE FROM activity_logs WHERE activity_logs.id = $1 RETURNING id;`,
      [id]
    );
  }
}

export default ActivityLogService;
