import { createInputValidator } from "./utils.mjs";

export default {
  async create(dbClient, { label, icon, color }, userId) {
    console.log("RES", userId);
    try {
      const res = await dbClient.query(
        `INSERT INTO categories (user_id, label, icon, color) VALUES ($1, $2, $3, $4) RETURNING id;`,
        [userId, label, icon, color]
      );

      return {
        ok: true,
        data: res.rows[0].id,
      };
    } catch (e) {
      return {
        ok: false,
        message: e.message,
      };
    }
  },

  validateInput(input) {
    let validator = createInputValidator(["label", "icon", "color"]);
    return validator(input);
  },
};
