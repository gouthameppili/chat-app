import jwt from 'jsonwebtoken';
import { ENV } from './env.js';

const generateToken = (userId, res) => {

    const { JWT_SECRET } = ENV;
    if(!JWT_SECRET){
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

     const token = jwt.sign({ id: userId }, ENV.JWT_SECRET, {
         expiresIn: '7d',
     });

     res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: ENV.NODE_ENV === "production" ? false : true,
     });

     return token;
}

export default generateToken;