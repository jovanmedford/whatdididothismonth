import { Client } from "pg";
import CategoryService from "./services/category";
import ActivityService from "./services/activity";
import ActivityLogService from "./services/activity-log";
import { Service } from "./types";

export class Director {
  steps: Step[] = [];
  initialId: string | undefined;

  constructor(
    private dbClient: Client,
    private executionMap = defaultExecutionMap
  ) {
    this.dbClient = dbClient;
    this.executionMap = executionMap;
  }

  addStep(step: Step) {
    this.steps.push(step);
  }

  setInitialId(id: string) {
    this.initialId = id;
  }

  async execute() {
    let prevId: string | undefined = this.initialId;
    try {
      await this.dbClient.query("BEGIN;");

      for (let step of this.steps) {
        let executor = this.executionMap.get(step.type);

        if (!executor) {
          throw Error("Incorrect build steps.");
        }
        console.log("----Executor:", step.type, executor);
        let res = await executor.create(
          this.dbClient,
          { ...step.data },
          prevId
        );

        if (!res.ok) {
          throw new Error(res.message);
        }

        console.log("Result", res)

        prevId = res.data[0].id;
      }

      await this.dbClient.query("COMMIT;");
      return { ok: true, data: prevId };
    } catch (e) {
      await this.dbClient.query("ROLLBACK");
      return { ok: false, message: e.message };
    }
  }
}

export interface Step {
  type: string;
  data: any;
}

const defaultExecutionMap = new Map<string, Service<any, any>>([
  ["category", CategoryService],
  ["activity", ActivityService],
  ["activityLog", ActivityLogService],
]);
