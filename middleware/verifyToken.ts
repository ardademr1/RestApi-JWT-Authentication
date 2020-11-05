import jwt from 'jsonwebtoken';
import * as Express from "express";
import { IUser } from '../interfaces';

module.exports = {
    generateAccessToken: (user: IUser)=>{
        return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m'})
    },
    generateRefreshToken: (user: IUser)=>{
        return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '10m'})
    },
    verifyToken: (req: Express.Request,res: Express.Response,next: Express.NextFunction)=>{
        const authHeader = req.headers['authorization']
        const token = authHeader
        if(!token) return res.status(401).send('Access Denied');
        try{
            const tokenData = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
            req.tokenUser = tokenData;
            next();
        }catch(err){
            res.status(400).send('Invalid Token');
        }
    },
}

