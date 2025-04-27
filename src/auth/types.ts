import { Request } from "express";
import { RoleEnums } from "../constants";
import { IUser } from "users/models/users.model";
import { TokenPayload } from "../service/token.service";



export enum AuthMethod {
    GoogleOAuth = 'google_oauth',
    EmailPassword = 'email_password',
    PhoneNumberPassword = 'phone_number_password',
    UsernamePassword = 'username_password',
}

export interface UsernamePasswordLogin {
    method: AuthMethod.UsernamePassword;
    username: string;
    password: string;
}

export interface EmailPasswordSignup {
    email: string;
    password: string;
    method: AuthMethod.EmailPassword;
    fullName: string;
    phoneNumber: string;
    role: RoleEnums;
}

export type EmailPhoneSignupParams = EmailPasswordSignup

export type SignupParams = EmailPhoneSignupParams


export interface ISignUpRequest extends Request {
    body: SignupParams;
}


export type LoginParams = UsernamePasswordLogin


export interface ILoginRequest extends Request {
    body: LoginParams;
}
export interface AuthResult {
    user: IUser;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface UnAuthenticatedRequest extends Request {
    user?: TokenPayload;
}