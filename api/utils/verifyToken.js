import jwt from 'jsonwebtoken';
import {errorHandler} from './error.js';

export const verifyToken = async(req, res, next) => {
    //console.log('acces_token from verifyToken: ' + req.cookies.access_token);
    const token = req.cookies.access_token;
    if(!token) return next(errorHandler(401, 'Unauthorized!'));
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            //console.log(err);
            return next(errorHandler(401, 'Unauthorized!'));
        }
        // return next(errorHandler(401, 'Unauthorized!'));
        req.user = user;
        //console.log('user from verify user: ' + JSON.stringify(req.user.id) )
        next();
    })
}