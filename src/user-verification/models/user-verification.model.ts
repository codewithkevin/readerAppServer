import mongoose from 'mongoose';

export enum EVerificationAction {
    EmailVerification = 'EmailVerification',
    EmailSignupVerification = 'EmailSignupVerification',
    PhoneNumberVerification = 'PhoneNumberVerification',
    PhoneNumberSignupVerification = 'PhoneNumberSignupVerification',
    Login2fa = 'Login2fa',
    ResetPassword = 'ResetPassword',
}

export enum EVerificationType {
    Otp = 'Otp',
    Token = 'Token',
}
export enum EVerificationReceiverMode {
    Email = 'Email',
    Phone = 'Phone',
}

export interface VerificationReceiver {
    mode: EVerificationReceiverMode;
    payload: string;
}

export interface UserVerification {
    _id: string;
    userId: string;
    verificationCode: string;
    expiresIn: number;
    action: EVerificationAction;
    verificationType: EVerificationType;
    receiver: VerificationReceiver;
}

const receiverSchema = new mongoose.Schema<VerificationReceiver>(
    {
        mode: { required: true, type: String },
        payload: { required: true, type: String },
    },
    { _id: false },
);

const schema = new mongoose.Schema<UserVerification>({
    userId: { required: true, type: String, index: true },
    verificationCode: { required: true, type: String },
    expiresIn: { required: true, type: Number },
    action: { required: true, type: String },
    verificationType: { required: true, type: String },
    receiver: receiverSchema,
});

schema.index({ userId: 1, action: 1 }, { unique: true });

export const userVerificationModel = mongoose.model('User-Verification', schema);
