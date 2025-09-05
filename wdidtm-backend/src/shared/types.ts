export type Result<T = any> = SuccessResult<T> | ErrorResult;

export interface SuccessResult<T = any> {
  ok: true;
  data: T;
}

export interface ErrorResult {
  ok: false;
  message: string;
}

export interface UserInput {
  email: string;
  firstName: string;
  lastName: string;
}

export interface CategoryInput {
  label: string;
  color: string;
  icon: string;
}

export interface ActivityInput {
  label: string;
}

export interface ActivityLogInput {
  year: number;
  month: number;
  target: number;
}

export interface SuccessLogInput {
  day: number;
}
