import { createInputValidator } from "./utils.mjs"

export default {
  async create(dbClient, { year, month, target }, activityId) {
    try {
      const res = await dbClient.query(
        `INSERT INTO activity_logs (activity_id, year, month, target) VALUES ($1, $2, $3, $4) RETURNING id;`,
        [activityId, year, month, target]
      );
      return {
        ok: true,
        data: res.rows[0].id,
      };
    } catch (e) {
      console.error("Console logged error --->", e);
      return {
        ok: false,
        message: e.message,
      };
    }
  },

  validateInput(input) {
    let validator = createInputValidator(["year", "month", "target"]);
    return validator(input);
  },
};
