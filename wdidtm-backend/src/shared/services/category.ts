import { Client } from "pg";
import { Category, CategoryInput, Service } from "../types";
import { executeQuery, createInputValidator } from "../utils";
import { UNCATEGORIZED_ID } from "../constants";

class CategoryService implements Service<Category, CategoryInput> {
  constructor(private dbClient: Client) {}

  async builderCreate(
    { label, icon, color }: Omit<CategoryInput, "userId">,
    userId: string
  ) {
    return await executeQuery(
      this.dbClient,
      `INSERT INTO categories (user_id, label, icon, color) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [userId, label, icon, color]
    );
  }

  async create(input: CategoryInput) {
    return await executeQuery<Category>(
      this.dbClient,
      `INSERT INTO categories (user_id, label, icon, color) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [input.userId, input.label, input.icon, input.color]
    );
  }

  async findAllByUser(userId: string) {
    return await executeQuery<Category>(
      this.dbClient,
      `SELECT * FROM categories WHERE user_id = $1;`,
      [userId]
    );
  }

  async getUncategorized() {
    return await executeQuery<Category>(
      this.dbClient,
      `SELECT * FROM categories WHERE id = $1;`,
      [UNCATEGORIZED_ID]
    );
  }

  validateInput(input: CategoryInput) {
    let validator = createInputValidator(["label", "icon", "color"]);
    return validator(input);
  }
}

export default CategoryService;
