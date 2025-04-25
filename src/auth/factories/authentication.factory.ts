import { AuthenticationStrategy } from "../strategies/authentication.strategy";
import { EmailPasswordAuthentication } from "../strategies/email_password.strategy";
import { UsernamePasswordAuthentication } from "../strategies/shared_username.strategy";
import { AuthMethod } from "../types";
import { BadRequestException } from "../../error-handling/exceptions/http.exceptions";



export const createAuthenticationMethod = (authMethod: AuthMethod): AuthenticationStrategy => {
    switch (authMethod) {
        case AuthMethod.EmailPassword:
            return new EmailPasswordAuthentication();
        case AuthMethod.UsernamePassword:
            return new UsernamePasswordAuthentication();

        default:
            throw new BadRequestException('Invalid authentication method');
    }
}