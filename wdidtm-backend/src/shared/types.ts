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

export type CategoryInput = Omit<Category, "id" | "userId">;

export interface Activity {
  id: string;
  catId: string;
  label: string;
}

export type ActivityInput = Omit<Activity, "id" | "catId">;

export interface ActivityLog {
  activityLogId: string;
  id: string;
  year: number;
  month: number;
  target: number;
}

export type ActivityLogInput = Omit<ActivityLog, "id" | "activityLogId">;

export interface SuccessLog {
  id: string;
  activityLogId: string;
  day: number;
}

export type SuccessLogInput = Omit<SuccessLog, "id" | "activityLogId">;

export interface Builder {
  create: (
    dbClient: Client,
    { label }: { label: string },
    parentId: string
  ) => Promise<Result<{ id: string }[]>>;
}

export interface Service<T, U> {
  create: (
    dbClient: Client,
    input: U,
    parentId: string
  ) => Promise<Result<T[]>>;
  validateInput: (input: U) => Result;
  getByUser?: (dbClient: Client, userId: string) => Promise<Result<T[]>>;
  getByCategory?: (
    dbClient: Client,
    categoryId: string
  ) => Promise<Result<T[]>>;
  delete?(dbClient: Client, id: string): Promise<Result<string[]>>;
  delete?(
    dbClient: Client,
    input: U,
    parentId: string
  ): Promise<Result<string[]>>;
}
