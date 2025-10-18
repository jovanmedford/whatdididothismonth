import { Client } from "pg";
import { Service, SuccessLog, SuccessLogInput } from "../types";
import { executeQuery, createInputValidator } from "../utils";

class SuccessLogService implements Service<SuccessLog, SuccessLogInput> {
  constructor(private dbClient: Client) {}

  async builderCreate(
    { day }: Omit<SuccessLogInput, "activityLogId">,
    activityLogId: string
  ) {
    return await executeQuery(
      this.dbClient,
      `INSERT INTO success_logs (activity_log_id, day) VALUES ($1, $2) RETURNING *;`,
      [activityLogId, day]
    );
  }

  async create(input: SuccessLogInput) {
    return await executeQuery<SuccessLog>(
      this.dbClient,
      `INSERT INTO success_logs (activity_log_id, day) VALUES ($1, $2) RETURNING *;`,
      [input.activityLogId, input.day]
    );
  }

  validateInput(input: SuccessLogInput) {
    let validator = createInputValidator(["day"]);
    return validator(input);
  }

  async deleteByDay(day: number, activityLogId: string) {
    return await executeQuery<string>(
      this.dbClient,
      `DELETE FROM success_logs WHERE activity_log_id = $1 AND day = $2 RETURNING id;`,
      [activityLogId, day]
    );
  }
}

export default SuccessLogService;
