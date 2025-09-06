import { Client } from "pg";
import { err, success } from "./utils";

export default {
  async create(
    dbClient: Client,
    { label }: { label: string },
    categoryId: string
  ) {
    try {
      const res = await dbClient.query(
        `INSERT INTO activities (cat_id, label) VALUES ($1, $2) RETURNING id;`,
        [categoryId, label]
      );
      return success(res.rows[0].id);
    } catch (e) {
      if (e instanceof Error) {
        return err(e);
      }
      return err("An unknown error occured");
    }
  },
};
