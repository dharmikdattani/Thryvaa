import { NextFunction, Request, Response } from "express";
import httpStatusCodes from "http-status-codes";

// Extend the Express Response type by declaring a module augmentation
declare global {
  namespace Express {
    export interface Response {
        sendRes: (statusCode?: number, message?: string, data?: any) => Response;
    }
  }
}

/**
 * Enhances the response object with a custom method to standardize API responses.
 * 
 * @param req - The HTTP request object.
 * @param res - The HTTP response object, augmented with a `sendRes` method.
 * @param next - The next middleware function in the stack.
 */
export function apiResponseHandler(req: Request, res: Response, next: NextFunction) {
  /**
   * Sends a standardized API response.
   * 
   * @param statusCode - The HTTP status code of the response (default is 200).
   * @param message - The message to send in the response (default is an empty string).
   * @param data - The data to send in the response; if null, only message is sent.
   * 
   * @example
   * // Sending a successful response with data
   * res.sendRes(200, 'Data fetched successfully', { id: 1, name: 'John Doe' });
   * 
   * @example
   * // Sending an error response
   * res.sendRes(404, 'Data not found');
   */
  res.sendRes = function(statusCode = 200, message: string = '', data = null) {
    let responseData: {
      success: boolean;
      message?: string;
      error?: any;
    } = {
      success: statusCode === (httpStatusCodes.OK || httpStatusCodes.CREATED || httpStatusCodes.NO_CONTENT) ? true : false,
      message: message || "Success"
    }
    
    if (!data) return res.status(statusCode).send(responseData);

    const validStatusCode = [httpStatusCodes.OK, httpStatusCodes.CREATED, httpStatusCodes.ACCEPTED, httpStatusCodes.NO_CONTENT];
    // Success data
    if (validStatusCode.includes(statusCode)) {
      responseData = {...responseData, ...(typeof data === 'object' ? data : {})};
    } else {
      // Error data
      responseData.error = data;
    }
    return res.status(statusCode).send(responseData);
  }
  next();
}
