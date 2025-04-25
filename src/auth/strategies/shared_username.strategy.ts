import { AuthResult, UsernamePasswordLogin } from "../types";
import { BaseAuthenticationStrategy } from "./base.strategy";
import { usernamePasswordLoginValidator } from "../auth.validator";
import { BadRequestException, NotFoundException } from "../../error-handling/exceptions/http.exceptions";
import { IUser } from "../../users/models/users.model";
import { getUserByUsername } from "../../users/services/user.service";
import { tokenService } from "../../service/token.service";



export class UsernamePasswordAuthentication extends BaseAuthenticationStrategy {
    public validateLoginInput(params: UsernamePasswordLogin): void {
        const validationResult = usernamePasswordLoginValidator.validate(params);

        if (validationResult.error) {
            throw new BadRequestException(validationResult.error.details[0].message);
        }
    }

    public async login(params: UsernamePasswordLogin): Promise<AuthResult> {

        this.validateLoginInput(params)

        const existingUser = await getUserByUsername(params.username);

        if (!existingUser)
            throw new NotFoundException('User does not exist');

        const user = existingUser as IUser;

        const isPasswordValid = await user.comparePassword(params.password);

        if (!isPasswordValid)
            throw new BadRequestException('Invalid password');

        const tokens = tokenService.generateTokens(user);

        user.refreshToken = tokens.refreshToken;
        await user.save();


        return { user, tokens };
    }
}