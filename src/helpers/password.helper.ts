import bcrypt from 'bcrypt';

export const encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (plainTextPassword: string, hashedPassword: string) => {
    return bcrypt.compare(plainTextPassword, hashedPassword);
};
