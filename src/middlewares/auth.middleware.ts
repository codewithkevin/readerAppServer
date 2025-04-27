import { Response, NextFunction } from 'express';
import { HTTPStatusCode } from "../error-handling/http/http-status-codes.enum";
import { tokenService } from "../service/token.service";
import { createCookie } from "../auth/services/auth.service";
import { getUserById } from "../users/services/user.service";
import { UnAuthenticatedRequest } from 'auth/types';
import { UnauthorizedException } from '../error-handling/exceptions/http.exceptions';

export const authMiddleware = async (req: UnAuthenticatedRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.ReaderApp;
    const refreshToken = req.cookies.ReaderApp_refresh;

    if (!accessToken) {
        return new UnauthorizedException()
    }

    const decodedAccessToken = tokenService.verifyAccessToken(accessToken);

    if (decodedAccessToken) {
        req.user = decodedAccessToken;
        return next();
    }

    if (refreshToken) {
        try {
            const decodedRefreshToken = tokenService.verifyRefreshToken(refreshToken);

            if (!decodedRefreshToken) {
                return res.status(HTTPStatusCode.Unauthorized).json({
                    status: 'fail',
                    message: 'Invalid refresh token. Please log in again.'
                });
            }

            const user = await getUserById(decodedRefreshToken.id);

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(HTTPStatusCode.Unauthorized).json({
                    status: 'fail',
                    message: 'Invalid refresh token. Please log in again.'
                });
            }

            const tokens = tokenService.generateTokens(user);

            user.refreshToken = tokens.refreshToken;
            await user.save();

            const accessTokenExpiry = Math.floor(24 * 60 * 60);
            const refreshTokenExpiry = Math.floor(365 * 24 * 60 * 60);

            const cookieConfig = createCookie(
                tokens.accessToken,
                tokens.refreshToken,
                accessTokenExpiry
            );

            res.cookie(cookieConfig.name, cookieConfig.data, cookieConfig.options);
            res.cookie(
                `${cookieConfig.name}_refresh`,
                cookieConfig.refreshToken,
                {
                    ...cookieConfig.options,
                    maxAge: refreshTokenExpiry * 1000,
                }
            );

            req.user = {
                id: user._id, username:
                    user.username,
                name: user.fullName,
                role: user.role
            };
            return next();
        } catch (error) {
            return res.status(HTTPStatusCode.Unauthorized).json({
                status: 'fail',
                message: 'Error refreshing token. Please log in again.'
            });
        }
    }

    return res.status(HTTPStatusCode.Unauthorized).json({
        status: 'fail',
        message: 'Your session has expired. Please log in again.'
    });
};