import express from 'express';
import { handleAsyncErrors } from '../helpers/route.helper';
import { login, signUp } from './controllers/auth.controller';
import { loginRateLimiter, signupRateLimiter } from '../helpers/rate-limiter';


const router = express.Router();

router.post('/login', loginRateLimiter, handleAsyncErrors(login));

router.post('/signup', signupRateLimiter, handleAsyncErrors(signUp));



export default router;