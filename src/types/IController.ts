import { Response } from 'express';
import { IRequest } from './IRequest';

export interface IController {
  (req: IRequest, res: Response): void;
}
