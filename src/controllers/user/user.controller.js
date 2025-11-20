// import expressAsyncHandler from 'express-async-handler'
// import userModel from '../../models/user.model.js';
// import ApiResponse from '../../utils/ApiResponse.utils.js';
// import CustomError from '../../utils/CustomError.utils.js';

// export const registerUser = expressAsyncHandler(async(req, res,next)=>{
//     let {username, email, password, contactNumber} =req.body;

//     const newUser = await userModel.create({
//         username,
//         email, 
//         password,
//         contactNumber
//     })

//     //$ res
//     //$     .status(201)
//     //$     .json({
//     //$         success:true, message:"User registered Successfully", newUser
//     //$     })

//     new ApiResponse("201", "User Registered Successfully", newUser).send(res)
// })

// export const loginUser = expressAsyncHandler(async(req, res ,next)=>{
//     const {email, password} = req.body;
//     let existingUser = await userModel.findOne({email})
//     if(!existingUser) next(new CustomError(401, "Invalid credentials"))

//     let matchPassword = await existingUser.compare(password)

//     if(!matchPassword){

//     }
// })

import expressAsyncHandler from "express-async-handler";
import UserModel from "../../models/user.model.js";
import ApiResponse from "../../utils/ApiResponse.utils.js";
import CustomError from "../../utils/CustomError.utils.js";
import { generateToken } from "../../utils/jwt.utils.js";

export const registerUser = expressAsyncHandler(async (req, res, next) => {
    const { username, email, password, contactNumber } = req.body;

    const newUser = await UserModel.create({
        username,
        email,
        password,
        contactNumber,
    });

    //   res
    //     .status(201)
    //     .json({ success: true, message: "User Registered Successfully", newUser });

    let emailVerificationToken = newUser.generateEmailVerificationToken();
    console.log(emailVerificationToken);
    await newUser.save()
    

    new ApiResponse(201, "User Registered Successfully", newUser).send(res);
});

export const loginUser = expressAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser = await UserModel.findOne({ email });
    if (!existingUser) next(new CustomError(400, "Email Not Found!!!"));

    let matchPassword = await existingUser.comparePassword(password);
    if (!matchPassword) {
        // throw new CustomError(401, "Password Not Matched");
        next(new CustomError(401, "Password Not Matched"));
    }

    //! is isVerified is set to true

    let token = generateToken(existingUser._id)
    console.log(token);

    res.cookie("token", token, {
        maxAge: process.env.JWT_TOKEN_EXPIRY * 60 * 60 * 1000, //? pass expiration time in milliseconds (1hr)
        httpOnly: true, //? this cookie will only be accessible by the server not by browser (for security purpose)
    })

    new ApiResponse(200, "User Logged In Successfully").send(res);
});

export const logoutUser = expressAsyncHandler(async (req, res, next) => {
    res.clearCookie("token");

    new ApiResponse(200, "User Logged out successfully").send(res)
});

//$ this is for frontend --> check the success, if true means logged in, else not logged in then redirect client to  login oage or home page
export const currentUser = expressAsyncHandler(async (req, res, next) => {
    new ApiResponse(200, "User is logged in").send(res)
});

export const updateProfile = expressAsyncHandler(async (req, res, next) => {
    //! excluding password, update reset

    const updatedUser = await UserModel.findOneAndUpdate(
        req.myUser._id,
        req.body,
        {
            new: true, //? it returns the updated document
            runValidators: true, //? validate the updated document against th schema
        }
    )
    if (!updatedUser) next(new CustomError(404, "User not Found"));

    new ApiResponse(200, "User updated successgullt", updatedUser).send(res)


});

export const changePassword = expressAsyncHandler(async (req, res, next) => {
    const existingUser = await UserModel.findById(req.myUser._id)

    existingUser.password = req.body.password
    await existingUser.save()

    new ApiResponse(200,"Password Updated Successfully").send(res)
});

export const forgotPassword = expressAsyncHandler(async (req, res, next) => { });

export const resetPassword = expressAsyncHandler(async (req, res, next) => { });

//! login, logout -> (token generation), authenticate middleware