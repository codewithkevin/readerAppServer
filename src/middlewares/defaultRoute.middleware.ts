import type { Request, Response } from 'express';

const defaultRoutesHandler = (req: Request, res: Response): void => {
    res.status(404).send('Route not found');
};

export default defaultRoutesHandler;
