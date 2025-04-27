import { DatabaseClient } from '../../database/client';
import {
    userVerificationModel,
    UserVerification,
    EVerificationAction,
    EVerificationType,
    VerificationReceiver,
} from '../models/user-verification.model';
import { VERIFICATION_CODE_EXPIRY_MS } from '../constants';
import { NotFoundException } from '../../error-handling/exceptions/http.exceptions';
import { encryptPassword } from '../../helpers/password.helper';

export class UserVerificationService {
    public async saveUserVerificationToDb(params: {
        userId: string;
        verificationCode: string;
        action: EVerificationAction;
        verificationType: EVerificationType;
        receiver: VerificationReceiver;
    }): Promise<UserVerification> {
        await DatabaseClient.getDatabaseConnection();
        const { userId, verificationCode, action, verificationType, receiver } = params;

        const hashedCode = await encryptPassword(verificationCode);
        const expiresIn = Date.now() + VERIFICATION_CODE_EXPIRY_MS;

        const data = new userVerificationModel({
            userId,
            verificationCode: hashedCode,
            expiresIn,
            action,
            verificationType,
            receiver,
        });

        return data.save();
    }

    public async getUserVerificationsByUserId(userId: string): Promise<UserVerification[]> {
        await DatabaseClient.getDatabaseConnection();
        return userVerificationModel.find({ userId }).lean();
    }

    public async getUserVerificationInfoFromDb(
        userId: string,
        action: EVerificationAction,
    ): Promise<UserVerification | null> {
        await DatabaseClient.getDatabaseConnection();
        return userVerificationModel.findOne({ userId, action }).lean();
    }

    public async getUserVerificationInfoFromDbById(id: string): Promise<UserVerification | null> {
        await DatabaseClient.getDatabaseConnection();
        return userVerificationModel.findOne({ _id: id }, { password: 0 }).lean();
    }

    public async updateUserVerificationCodeInDB(
        userId: string,
        action: EVerificationAction,
        verificationCode: string,
    ): Promise<UserVerification> {
        await DatabaseClient.getDatabaseConnection();

        const info = await this.getUserVerificationInfoFromDb(userId, action);

        if (!info) {
            throw new NotFoundException('A valid verification information is required');
        }

        const hashedCode = await encryptPassword(verificationCode);
        const expiresIn = Date.now() + VERIFICATION_CODE_EXPIRY_MS;

        const toBeUpdated = {
            ...info,
            verificationCode: hashedCode,
            expiresIn,
        };

        const results = await userVerificationModel
            .findByIdAndUpdate(info._id.toString(), toBeUpdated, { new: true })
            .lean();
        return results!;
    }

    public async deleteUserVerification(userId: string, action: EVerificationAction) {
        try {
            await DatabaseClient.getDatabaseConnection();
            await userVerificationModel.deleteOne({ userId, action });
        } catch (err) {
            // do nothing
        }
    }
}
