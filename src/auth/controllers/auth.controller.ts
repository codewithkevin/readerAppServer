import { createCookie } from "../services/auth.service";
import { HTTPStatusCode } from "../../error-handling/http/http-status-codes.enum";
import { createAuthenticationMethod } from "../factories/authentication.factory";
import { ILoginRequest, ISignUpRequest } from "../types";
import { Response } from "express";
import { getTokenExpiration } from "../../helpers/getTokenExpiration";

export const signUp = async (req: ISignUpRequest, res: Response) => {
    const body = req.body;

    const authStrategy = createAuthenticationMethod(body.method);
    const { tokens } = await authStrategy.signup(body);

    const accessTokenExpiry = getTokenExpiration(tokens.accessToken);
    const refreshTokenExpiry = getTokenExpiration(tokens.refreshToken);

    const cookieConfig = createCookie(
        tokens.accessToken,
        tokens.refreshToken || "",
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

    return res.status(HTTPStatusCode.Ok).json({
        isLoggedIn: true,
    });
}

export const login = async (req: ILoginRequest, res: Response) => {
    const body = req.body;

    const user = await createAuthenticationMethod(body.method).login(body);

    const accessTokenExpiry = getTokenExpiration(user.tokens.accessToken);
    const refreshTokenExpiry = getTokenExpiration(user.tokens.refreshToken);

    const cookieConfig = createCookie(
        user.tokens.accessToken,
        user.tokens.refreshToken || "",
        accessTokenExpiry
    );

    res.cookie(cookieConfig.name, cookieConfig.data, cookieConfig.options);

    if (cookieConfig.refreshToken) {
        res.cookie(
            `${cookieConfig.name}_refresh`,
            cookieConfig.refreshToken,
            {
                ...cookieConfig.options,
                maxAge: refreshTokenExpiry * 1000,
            }
        );
    }

    return res.status(HTTPStatusCode.Ok).json({
        isLoggedIn: true,
    });
}

export const logout = async (req: Request, res: Response) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.APP_ENV === 'production',
        sameSite: process.env.APP_ENV === 'production' ? 'none' as const : 'lax' as const,
        path: '/',
    };

    res.clearCookie('ReaderApp', cookieOptions);
    res.clearCookie('ReaderApp_refresh', cookieOptions);

    return res.status(HTTPStatusCode.Ok).json({
        status: 'success',
        message: 'Logged out successfully',
        isLoggedIn: false
    });
};
