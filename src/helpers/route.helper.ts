import { NextFunction, Request, Response } from 'express';

export const handleAsyncErrors =
    // eslint-disable-next-line @typescript-eslint/ban-types
    (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
