import { HTTPStatusCode } from "../../error-handling/http/http-status-codes.enum";
import { createAuthenticationMethod } from "../factories/authentication.factory";
import { ILoginRequest, ISignUpRequest } from "../types";
import { Response } from "express";



export const signUp = async (req: ISignUpRequest, res: Response) => {
    const body = req.body;

    const authStrategy = createAuthenticationMethod(body.method);
    const { user, tokens } = await authStrategy.signup(body);

    return res.status(HTTPStatusCode.Ok).json({
        status: 'success',
        data: user,
        tokens: tokens
    });
}

export const login = async (req: ILoginRequest, res: Response) => {
    const body = req.body;

    const user = await createAuthenticationMethod(body.method).login(body);

    return res.status(HTTPStatusCode.Ok).json({
        // status: 'success',
        // data: user,
        tokens: user.tokens
    });
}