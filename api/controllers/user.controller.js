import User from "../models/user.model.js";
import { catchAsync } from "../utils/catchAsync.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json({message :"CatLovers API is working!"})
}

export const updateUser = catchAsync(async(req, res, next) => {
    if (req.user._id !== req.params.userId) return next(errorHandler(403, 'You are not authorized to update this user!'));
    if (req.body.password){
        if (req.body.password.length < 6 || req.body.password.length > 20) return next(errorHandler(400, 'Password must be between 6 and 20 characters long!'));
        req.body.password =  bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username){
        if (req.body.username.length < 7 || req.body.username.length >20) return next(errorHandler(400, 'Username must be between 7 and 20 characters long'));
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)) return next(errorHandler(400, 'Username must only contain letters and numbers!'));
        if(req.body.username !== req.body.username.toLowerCase()) return next(errorHandler(400, 'Username must be in lowercase'));
        if(req.body.username.includes(' ')) return next(errorHandler(400, 'Username must not contain spaces!'));
    };
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
        $set:{
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            avatar: req.body.avatar
        },
    }, {new: true});
    const {password,...userWithoutPassword} = updatedUser._doc;
    res
    .status(200)
    .json(userWithoutPassword);
})