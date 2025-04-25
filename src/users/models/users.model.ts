import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { AuthMethod } from 'auth/types';
import { AccountStatusEnum, AccountStatuses, RoleEnums, RoleSatuses } from '../../constants';

export type SignupMethod =
    | AuthMethod.GoogleOAuth
    | AuthMethod.EmailPassword
    | AuthMethod.PhoneNumberPassword;


export interface IUserInput {
    email: string;
    password: string;
    signupMethod: SignupMethod;
    fullName: string;
    phoneNumber: string;
    role: RoleEnums;
}

export interface IUser extends IUserInput, Document {
    _id: string;
    username: string;
    refreshToken: string;
    profilePicture?: string;
    digitalAddress?: string;
    accountStatus: AccountStatusEnum;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    signupMethod: { required: true, type: String },
    fullName: {
        type: String, required: true
        , minlength: 3, maxlength: 50
    },
    profilePicture: {
        type: String, default: null
    },
    phoneNumber: {
        type: String, required: true
        , minlength: 10, maxlength: 15
    },
    digitalAddress: {
        type: String,
        default: null
    },
    role: {
        type: String,
        required: true,
        enum: RoleSatuses
    },
    refreshToken: {
        type: String,
        default: null
    },
    accountStatus: {
        type: String, required: true,
        enum: AccountStatuses
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
