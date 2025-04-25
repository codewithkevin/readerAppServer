import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IUser } from 'users/models/users.model';


export interface TokenPayload {
    id: string;
    username: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export class TokenService {
    private accessTokenSecret: string;
    private refreshTokenSecret: string;

    constructor() {
        this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access-secret-key';
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';
    }

    generateTokens(user: IUser): Tokens {
        const payload: TokenPayload = {
            id: user._id,
            username: user.username
        };

        const accessToken = jwt.sign(
            payload,
            this.accessTokenSecret,
            { expiresIn: '24h' }
        );

        const refreshToken = jwt.sign(
            payload,
            this.refreshTokenSecret,
            { expiresIn: '1y' }
        );

        return { accessToken, refreshToken };
    }

    verifyAccessToken(token: string): TokenPayload | null {
        try {
            return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
        } catch (error) {
            return null;
        }
    }

    verifyRefreshToken(token: string): TokenPayload | null {
        try {
            return jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
        } catch (error) {
            return null;
        }
    }

    generateRefreshToken(): string {
        return crypto.randomBytes(40).toString('hex');
    }
}

export const tokenService = new TokenService()