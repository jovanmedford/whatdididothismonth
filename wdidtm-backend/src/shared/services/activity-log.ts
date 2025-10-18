import { Client } from "pg";
import { ActivityLog, ActivityLogInput, ActivityLogResult, Service } from "../types";
import { executeQuery, createInputValidator } from "../utils";
import { SYSTEM_USER_ID } from "../constants";

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

  async getByDate({
    year,
    month,
    userId,
  }: {
    year: number;
    month: number;
    userId: string;
  }) {
    return await executeQuery<ActivityLogResult>(
      this.dbClient,
      `SELECT
    activity_logs.id AS "id",
    activities.id AS "activityId",
    activities.label AS "activityName",
    categories.label AS "categoryName",
    categories.color AS "categoryColor",
    categories.icon AS "categoryIcon",
    COALESCE(
    json_agg(success_logs.day) FILTER (WHERE success_logs.day IS NOT NULL),
    '[]'::json
    ) AS successes,
    activity_logs.target target
FROM
    users
    JOIN categories ON users.id = categories.user_id
    JOIN activities ON categories.id = activities.cat_id
    JOIN activity_logs ON activities.id = activity_logs.activity_id
    LEFT JOIN success_logs ON activity_logs.id = success_logs.activity_log_id
WHERE
    (users.id = $1 OR categories.user_id = $2) AND activity_logs.year = $3 AND activity_logs.month = $4
GROUP BY
    activity_logs.id,
    activities.id,
    activities.label,
    categories.label,
    categories.color,
    categories.icon,
    activity_logs.target;`,
      [userId, SYSTEM_USER_ID, year, month]
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
