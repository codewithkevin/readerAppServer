import { AuthResult, EmailPasswordSignup } from "../types";
import { UsernamePasswordAuthentication } from "./shared_username.strategy";
import { emailPasswordSignupValidator } from "../auth.validator";
import { BadRequestException } from "../../error-handling/exceptions/http.exceptions";
import { getUserByUsername } from "../../users/services/user.service";
import { tokenService } from "../../service/token.service";
import { AccountStatusEnum } from "../../constants";



export class EmailPasswordAuthentication extends UsernamePasswordAuthentication {
    public validateSignupInput(params: EmailPasswordSignup): void {
        const validationResult = emailPasswordSignupValidator.validate(params);

        if (validationResult.error) {
            throw new BadRequestException(validationResult.error.details[0].message);
        }
    }

    public async signup(params: EmailPasswordSignup): Promise<AuthResult> {
        this.validateSignupInput(params);

        const username = params.email;
        const existingUser = await getUserByUsername(username);

        if (existingUser)
            throw new BadRequestException('User already exists');


        const userToSave = {
            ...params,
            signupMethod: params.method,
            username,
            accountStatus: AccountStatusEnum.Active,
        };

        const user = await this.createUser(userToSave);

        const tokens = tokenService.generateTokens(user);

        user.refreshToken = tokens.refreshToken;

        user.refreshToken = tokens.refreshToken;
        await user.save();

        return { user, tokens };
    }
}
