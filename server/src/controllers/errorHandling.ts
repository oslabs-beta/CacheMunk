import { Request, Response, NextFunction } from 'express';

/**
 * Async middleware wrapper for Express.
 * Wraps an asynchronous function, catching any errors and passing them to the next middleware.
 *
 * @param fn The asynchronous middleware function.
 * @returns A function that takes Express's req, res, and next parameters.
 */
export function asyncWrapper(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch((err: unknown) => {
      next(err);
    });
  };
}
