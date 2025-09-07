import { ActivityInput, Activity, Service } from "../types";
import { Client } from "pg";
import { executeQuery, createInputValidator } from "../utils";

const ActivityService: Service<Activity, ActivityInput> = {
  async create(
    dbClient: Client,
    { label }: { label: string },
    categoryId: string
  ) {
    return await executeQuery(
      dbClient,
      `INSERT INTO activities (cat_id, label) VALUES ($1, $2) RETURNING *;`,
      [categoryId, label]
    );
  },

  async getByUser(dbClient, userId) {
    return await executeQuery(
      dbClient,
      `SELECT * FROM activities 
       JOIN categories ON activities.cat_id = categories.id
       WHERE categories.user_id = $1;`,
      [userId]
    );
  },

  async getByCategory(dbClient, categoryId) {
        return await executeQuery(
      dbClient,
      `SELECT * FROM activities WHERE cat_id = $1;`,
      [categoryId]
    );
  },

  validateInput(input) {
    let validator = createInputValidator(["label"]);
    return validator(input);
  },
};

export default ActivityService;
