import jwt from 'jsonwebtoken';

const generateToken = (userId, res) => {
     const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
         expiresIn: '7d',
     });

     res.cookie("jwt", token, {
        maxAge: 7*1024*60*60*1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production" ? false : true,
     });

     return token;
}

export default generateToken;