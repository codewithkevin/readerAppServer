import jwt from 'jsonwebtoken';


export const getTokenExpiration = (token: string): number => {
    try {
        const decoded = jwt.decode(token);
        if (decoded && typeof decoded === 'object' && decoded.exp) {
            return decoded.exp - Math.floor(Date.now() / 1000);
        }
    } catch (error) {
        console.error('Error decoding token:', error);
    }
    return 3600;
};
