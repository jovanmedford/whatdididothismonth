export default {
  async canEditActivityLog(userId, activityLogId, dbClient) {
    if (!dbClient) {
      return false;
    }

    try {
      let text = `SELECT
    activity_logs.id
    FROM
    users
    JOIN categories ON users.id = categories.user_id
    JOIN activities ON categories.id = activities.cat_id
    JOIN activity_logs ON activities.id = activity_logs.activity_id
    WHERE activity_logs.id = $1;`;
      let res = await dbClient.query(text, [activityLogId]);

      if (!Array.isArray(res.rows) || res.rows == 0) {
        return false;
      }

      return res.rows[0].id === userId;
    } catch (e) {
      console.error("Error checking edit:", e);
      return false;
    }
  },
};
