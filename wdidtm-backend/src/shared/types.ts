import { Client } from "pg";

export type Result<T = any> = SuccessResult<T> | ErrorResult;

export interface SuccessResult<T = any> {
  ok: true;
  data: T;
}

export interface ErrorResult {
  ok: false;
  message: string;
}

export interface User {
  id: string;
  email: string;
}

export interface UserInput {
  email: string;
  firstName: string;
  lastName: string;
}

export interface Category {
  id: string;
  userId: string;
  label: string;
  color: string;
  icon: string;
}

export type CategoryInput = Omit<Category, "id">;

export interface Activity {
  id: string;
  userId: string;
  catId: string;
  label: string;
}

export type ActivityInput = Omit<Activity, "id">;

export interface ActivityLog {
  activityId: string;
  userId: string;
  id: string;
  year: number;
  month: number;
  target: number;
}

export interface ActivityLogResult {
  activityId: string;
  activityName: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  successes: number[];
  id: string;
  target: number;
}

export type ActivityLogInput = Omit<ActivityLog, "id">;

export interface SuccessLog {
  id: string;
  activityLogId: string;
  day: number;
}

export type SuccessLogInput = Omit<SuccessLog, "id">;

export interface Builder {
  builderCreate: (
    dbClient: Client,
    { label }: { label: string },
    parentId: string
  ) => Promise<Result<{ id: string }[]>>;
}

export interface Service<T, U> {
  create: (input: U) => Promise<Result<T[]>>;
  validateInput: (input: U) => Result;
  findAllByUser?: (userId: string) => Promise<Result<T[]>>;
  getByCategory?: (categoryId: string) => Promise<Result<T[]>>;
  delete?(id: string): Promise<Result<string[]>>;
}

export interface PostTestEventInput {
  body: null;
  headers: undefined;
  multiValueHeaders: undefined;
  isBase64Encoded: false;
  path: "";
  pathParameters: null;
  queryStringParameters: null;
  multiValueQueryStringParameters: null;
  stageVariables: null;
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };
  resource: "";
}
