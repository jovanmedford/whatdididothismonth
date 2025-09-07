
export const NOT_ENOUGH_DAYS_MESSAGE = "There aren't enough days left to meet this target."
export const MISSING_PROPERTIES_MESSAGE = "missing required properties."
export const NO_CLIENT_MESSAGE = "No db client found."

export class BadInputError extends Error {
    name = "BadInputError"
}

export class NotFoundError extends Error {
    name = "NotFoundError"
}