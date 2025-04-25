import { AuthResult, LoginParams, SignupParams } from '../types';
import { IUser, IUserInput } from '../../users/models/users.model';
import { saveUserToDB } from '../../users/services/user.service';
import { AuthenticationStrategy } from './authentication.strategy';

export abstract class BaseAuthenticationStrategy implements AuthenticationStrategy {
    public async login(_params: LoginParams): Promise<AuthResult> {
        throw new Error('Method not implemented.');
    }

    public async signup(_params: SignupParams): Promise<AuthResult> {
        throw new Error('Method not implemented.');
    }

    protected readonly createUser = async (input: IUserInput): Promise<IUser> => {
        return await saveUserToDB(input);
    }
}