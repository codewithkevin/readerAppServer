
import { AuthResult, LoginParams, SignupParams } from "../types";

export interface AuthenticationStrategy {
    login(params: LoginParams): Promise<AuthResult>;
    signup(params: SignupParams): Promise<AuthResult>;
    validateLoginInput?(params: LoginParams): void;
    validateSignupInput?(params: SignupParams): void;
}