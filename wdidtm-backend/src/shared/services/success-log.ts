import { Service, SuccessLog, SuccessLogInput } from "../types";
import { executeQuery, createInputValidator } from "../utils";

const SuccessLogService: Service<SuccessLog, SuccessLogInput> = {
  async create(dbClient, { day }, activityLogId) {
    return await executeQuery(
      dbClient,
      `INSERT INTO success_logs (activity_log_id, day) VALUES ($1, $2) RETURNING *;`,
      [activityLogId, day]
    );
  },

  validateInput(input) {
    let validator = createInputValidator(["day"]);
    return validator(input);
  },

  async delete(dbClient, { day }, activityLogId) {
    return await executeQuery(
      dbClient,
      `DELETE FROM success_logs WHERE activity_log_id = $1 AND day = $2;`,
      [activityLogId, day]
    );
  },
};

export default SuccessLogService
