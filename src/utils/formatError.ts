import { logger } from "../config/logger";

/**
 * Formats the error message based on the error code.
 * @param error - The error object to be formatted.
 * @returns The formatted error message.
 */
export const formatError = (error: any) => {
  logger.error(`error : ${JSON.stringify(error)}`);
  // Handle specific database error codes if error is not a standard Error
  if (error.code === "ER_DUP_ENTRY")
    return error.message;
  if (error.code === "ER_BAD_FIELD_ERROR")
    return error.sqlMessage;

  return error;
}
