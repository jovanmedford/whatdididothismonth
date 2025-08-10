export default {
  async canEditSuccessLog(email, activityLogId, dbClient) {
    if (!dbClient) {
      return false;
    }

    try {
      let text = `SELECT
    email
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

      return res.rows[0].email === email;
    } catch (e) {
      console.error("Error checking edit:", e);
      return false;
    }
  },
};
