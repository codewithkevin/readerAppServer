import UserModel, { IUserInput, IUser } from '../models/users.model';
import { DatabaseClient } from '../../database/client';


export const saveUserToDB = async (input: IUserInput): Promise<IUser> => {
    await DatabaseClient.getDatabaseConnection();
    const user = new UserModel(input);
    return user.save();
};

export const getUserByUsername = async (username: string): Promise<IUser | null> => {
    await DatabaseClient.getDatabaseConnection();
    return UserModel.findOne({ username });
};

export const getUserById = async (id: string): Promise<IUser | null> => {
    await DatabaseClient.getDatabaseConnection();
    return UserModel.findById(id);
}