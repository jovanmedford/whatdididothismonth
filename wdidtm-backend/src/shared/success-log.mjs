export default {
  async create(activityLogId, day, dbClient) {
    try {
      let text = `INSERT INTO success_logs (activity_log_id, day) VALUES ($1, $2) RETURNING activity_log_id;`;
      let res = await dbClient.query(text, [activityLogId, day]);
      return { ok: true, data: res.rows[0].activity_log_id };
    } catch (err) {
      console.error("Console logged error --->", err);
      return {
        ok: false,
        message: err.message,
      };
    }
  },
  async delete(activityLogId, day, dbClient) {
    try {
      let text = `DELETE FROM success_logs WHERE activity_log_id = $1 AND day = $2;`;
      await dbClient.query(text, [activityLogId, day]);
      return { ok: true, data: null };
    } catch (err) {
      console.error("Console logged error --->", err);
      return {
        ok: false,
        message: err.message,
      };
    }
  },
};
