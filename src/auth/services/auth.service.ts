

export const createCookie = (token: string, refreshToken: string, expiresIn: number) => {
    const APP_ENV = process.env.APP_ENV as string;
    const cookieDomain: { [key: string]: string } = {
        production: '',
        development: '',
    };
    const isInProdOrDev = ['production', 'development'].includes(APP_ENV);
    const none = 'none';

    if (isInProdOrDev)
        cookieDomain[APP_ENV] = none;

    return {
        name: 'ReaderApp',
        data: token,
        options: {
            httpOnly: isInProdOrDev,
            sameSite: isInProdOrDev ? ('none' as typeof none) : false,
            secure: isInProdOrDev,
            path: '/',
            domain: cookieDomain[APP_ENV],
            expires: new Date(Date.now() + expiresIn * 1000),
            maxAge: expiresIn * 1000,
        },
        refreshToken,
    };
}
