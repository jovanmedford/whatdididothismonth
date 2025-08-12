export default {
  async create(dbClient, { label }, categoryId) {
    try {
      const res = await dbClient.query(
        `INSERT INTO activities (cat_id, label) VALUES ($1, $2) RETURNING id;`,
        [categoryId, label]
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
};
