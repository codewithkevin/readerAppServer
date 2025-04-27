import { getUserById } from "../../users/services/user.service";
import { EVerificationAction, EVerificationReceiverMode, EVerificationType } from "../../user-verification/models/user-verification.model";
import { ForbiddenException, NotFoundException } from '../../error-handling/exceptions/http.exceptions';
import { UserVerificationService } from '../service/user-verification';
import { EmailClient } from '../../mail/mail.service';


export const initiateVerification = async ({
    userId,
    action,
    shouldSendNotification = true,
}: {
    userId: string;
    action: EVerificationAction;
    shouldSendNotification?: boolean;
}) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new NotFoundException('User does not exist.');
    }

    const isEmailVerification = [EVerificationAction.EmailVerification].includes(action);
    const isPhoneNumberVerification = [EVerificationAction.PhoneNumberVerification].includes(action);

    const isSignupVerification = [
        EVerificationAction.EmailSignupVerification,
        EVerificationAction.PhoneNumberSignupVerification,
    ].includes(action);

    if (
        isSignupVerification && user.isAccountVerified
    ) {
        throw new ForbiddenException('Cannot trigger verification when already verified');
    }

    const payloadMap: Record<string, string> = {
        [EVerificationAction.EmailVerification]: user.email,
        [EVerificationAction.PhoneNumberVerification]: user.phoneNumber,
        [EVerificationAction.EmailSignupVerification]: user.username,
        [EVerificationAction.PhoneNumberSignupVerification]: user.username,
    };

    const shouldUseEmail = [
        EVerificationAction.EmailVerification,
        EVerificationAction.EmailSignupVerification,
    ].includes(action);

    const verificationService = new UserVerificationService();

    const existingVerification = await verificationService.getUserVerificationInfoFromDb(
        userId,
        action,
    );

    if (existingVerification) {
        await verificationService.deleteUserVerification(userId, action);
    }

    if (shouldUseEmail) {

    }
}