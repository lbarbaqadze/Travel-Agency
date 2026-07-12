import jwt from 'jsonwebtoken';
import ms from 'ms'; 

export const generateTokens = (userId) => {
    
    const accessToken = jwt.sign( 
        { userId: userId }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN } 
    );

    const refreshToken = jwt.sign(
        { userId: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES }
    );

    return { accessToken, refreshToken };
};

const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: "/",
});

export const setTokenCookies = (res, accessToken, refreshToken) => {
    const cookieOptions = getCookieOptions(); 

    const accessTokenMaxAge = ms(process.env.JWT_EXPIRES_IN); 
    const refreshTokenMaxAge = ms(process.env.JWT_REFRESH_EXPIRES); 

    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: accessTokenMaxAge });
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: refreshTokenMaxAge });
};

export const clearTokenCookies = (res) => {
    const cookieOptions = getCookieOptions();
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions); 
};