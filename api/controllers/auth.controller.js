import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import { catchAsync } from "../utils/catchAsync.js";
import jwt from 'jsonwebtoken';

export const signup = catchAsync(async(req,res,next)=>{
    const{username,email,password} = req.body;
    if(!username ||!email ||!password || username === '' || email === '' || password === '') return next(errorHandler(400, 'All fields are required'));

    const hashedPassword =  bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })

    await newUser.save();
    res.json({message:'User created successfully'});
});
  
export const signin = catchAsync(async(req,res,next)=>{
    //read email and password from body
    const{email,password} = req.body;
    console.log(email,password);
    if(!email ||!password || email === '' || password === '') return next(errorHandler(400, 'All fields are required'));

    // find user by email
    const user = await User.findOne({email});
    console.log(user);

    // check if user exists and password is correct
    if (!user || !await user.correctPassword(password,user.password)) return next(errorHandler(401, 'Invalid credentials'));

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    
    // destructuring user object to send to client info without password
    const {password:pass, ...rest} = user._doc;

    res
        .status(200)
        .cookie('access_token', token, {
            httpOnly: true
        })
        .json(rest)  
})

