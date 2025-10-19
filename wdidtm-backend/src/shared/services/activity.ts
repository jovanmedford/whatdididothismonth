import { ActivityInput, Activity, Service } from "../types";
import { Client } from "pg";
import { executeQuery, createInputValidator } from "../utils";
import CategoryService from "./category";

class ActivityService implements Service<Activity, ActivityInput> {
  private categoryService: CategoryService;
  constructor(private dbClient: Client) {
    this.categoryService = new CategoryService(dbClient);
  }

  async create(input: ActivityInput) {
    return await executeQuery<Activity>(
      this.dbClient,
      `INSERT INTO activities (cat_id, label, user_id) VALUES ($1, $2, $3) RETURNING *;`,
      [input.catId, input.label, input.userId]
    );
  }

  async findOrCreate(input: { label: string; userId: string }) {
    const foundResult = await this.findByLabel(input);
    if (!foundResult.ok || foundResult.data.length > 0) return foundResult;

    const uncategorizedResult = await this.categoryService.getUncategorized();

    if (!uncategorizedResult.ok) return uncategorizedResult;

    return this.create({
      catId: uncategorizedResult.data[0]!.id,
      userId: input.userId,
      label: input.label,
    });
  }

  async builderCreate({ label }: { label: string }, categoryId: string) {
    return await executeQuery(
      this.dbClient,
      `INSERT INTO activities (cat_id, label) VALUES ($1, $2) RETURNING *;`,
      [categoryId, label]
    );
  }

  async findAllByUser(userId: string) {
    return await executeQuery<Activity>(
      this.dbClient,
      `SELECT activities.id id, activities.label label FROM activities 
       WHERE activities.user_id = $1;`,
      [userId]
    );
  }

  async findByLabel(input: { userId: string; label: string }) {
    return await executeQuery<Activity>(
      this.dbClient,
      `SELECT a.id, a.cat_id categoryId, a.label label FROM activities a 
      WHERE a.user_id = $1 AND LOWER(TRIM(a.label)) = LOWER(TRIM($2));`,
      [input.userId, input.label]
    );
  }

  async getByCategory(categoryId: string) {
    return await executeQuery<Activity>(
      this.dbClient,
      `SELECT activities.id id, activities.label label FROM activities WHERE cat_id = $1;`,
      [categoryId]
    );
  }

  validateInput(input: ActivityInput) {
    let validator = createInputValidator(["label"]);
    return validator(input);
  }
}

export default ActivityService;
