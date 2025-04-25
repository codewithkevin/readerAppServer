import type { Request, Response, NextFunction } from 'express';
import { isCelebrateError } from 'celebrate';
import { HTTPStatusCode } from '../../error-handling/http/http-status-codes.enum';
import { HttpStatusCode } from 'axios';
import type { IHTTPError } from 'error-handling/types';

export const errorMiddleware = (
    error: IHTTPError,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    if (isCelebrateError(error)) {
        return next(error);
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong';

    // log any error from 400 upwards except the ignored ones
    const ignoredLoggedErrorCodes = [
        HTTPStatusCode.BadRequest,
        HTTPStatusCode.NotFound,
        HttpStatusCode.Unauthorized,
    ];
    if (statusCode >= 400 && !ignoredLoggedErrorCodes.includes(statusCode)) {
        console.error(error);
    }

    res.status(statusCode).json({ status: 'error', message });
};
