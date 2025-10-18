export const NOT_ENOUGH_DAYS_MESSAGE =
  "There aren't enough days left to meet this target.";
export const MISSING_PROPERTIES_MESSAGE = "missing required properties.";
export const NO_CLIENT_MESSAGE = "No db client found.";
export const SERVER_ERROR_MESSAGE = "An error occurred.";
export const BAD_REQUEST_ERROR_MESSAGE = "Bad request.";
export const FORBIDDEN_ERROR_MESSAGE = "Forbidden resource";

export class BadInputError extends Error {
  name = "BadInputError";
}

export class NotFoundError extends Error {
  name = "NotFoundError";
}
