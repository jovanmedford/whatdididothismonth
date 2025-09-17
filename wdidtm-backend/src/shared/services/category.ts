import { Category, CategoryInput, Service } from "../types";
import { executeQuery, createInputValidator } from "../utils";

const CategoryService: Service<Category, CategoryInput> = {
  async create(dbClient, { label, icon, color }, userId) {
    return await executeQuery(
      dbClient,
      `INSERT INTO categories (user_id, label, icon, color) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [userId, label, icon, color]
    );
  },

  async getByUser(dbClient, userId) {
    return await executeQuery(
      dbClient,
      `SELECT * FROM categories WHERE user_id = $1;`,
      [userId]
    );
  },

  validateInput(input) {
    let validator = createInputValidator(["label", "icon", "color"]);
    return validator(input);
  },
};

export default CategoryService;
