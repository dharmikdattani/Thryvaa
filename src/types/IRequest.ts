import { Request } from 'express';

export interface IRequest extends Request {
    [x: string]: any;
  // Add any custom properties here
}
