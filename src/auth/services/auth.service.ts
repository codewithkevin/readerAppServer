export const createCookie = (token: string, refreshToken: string, expiresIn: number) => {
    const APP_ENV = process.env.APP_ENV || 'development';

    const cookieDomain: { [key: string]: string } = {
        production: process.env.COOKIE_DOMAIN || '',
        development: '',
    };

    const isProduction = APP_ENV === 'production';

    return {
        name: 'ReaderApp',
        data: token,
        options: {
            httpOnly: true, // Always use httpOnly for security
            sameSite: isProduction ? 'none' as const : 'lax' as const, // 'lax' is more secure than false
            secure: isProduction, // Use secure in production
            path: '/',
            domain: cookieDomain[APP_ENV] || undefined,
            expires: new Date(Date.now() + expiresIn * 1000),
            maxAge: expiresIn * 1000,
        },
        refreshToken,
    };
}