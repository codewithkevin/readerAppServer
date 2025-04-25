import { Request, Response, Router } from 'express';
import authRoutes from './auth/routes';

const router = Router();

router.use("/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        data: 'Welcome to the API'
    });
    return;
});

router.use('/auth', authRoutes);


export default router;