import Category from "../shared/category.mjs";
import Activity from "../shared/activity.mjs";
import ActivityLog from "../shared/activity-log.mjs";

export class Builder {
  steps = [];
  initialId;

  constructor(dbClient, executionMap = defaultExecutionMap) {
    this.dbClient = dbClient;
    this.executionMap = executionMap;
  }

  addStep(step) {
    this.steps.push(step);
  }

  setInitialId(id) {
    this.initialId = id;
  }

  async execute() {
    let prevId = this.initialId;
    try {
      await this.dbClient.query("BEGIN;");

      for (let step of this.steps) {
        let executor = this.executionMap.get(step.type);

        if (!executor) {
          throw Error("Incorrect build steps.");
        }
        console.log("----Executor:", executor);
        let res = await executor.create(
          this.dbClient,
          { ...step.data },
          prevId
        );

        if (!res.ok) {
          throw new Error(res.message);
        }

        prevId = res.data;
      }

      await this.dbClient.query("COMMIT;");
      return { ok: true, data: prevId };
    } catch (e) {
      await this.dbClient.query("ROLLBACK");
      return { ok: false, message: e.message };
    }
  }
}

const defaultExecutionMap = new Map([
  ["category", Category],
  ["activity", Activity],
  ["activityLog", ActivityLog],
]);
