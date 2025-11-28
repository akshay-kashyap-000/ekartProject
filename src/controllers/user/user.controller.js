import expressAsyncHandler from "express-async-handler";
import UserModel from "../../models/user.model.js";
import ApiResponse from "../../utils/ApiResponse.utils.js";
import CustomError from "../../utils/CustomError.utils.js";
import { generateToken } from "../../utils/jwt.utils.js";
import { sendEmail } from "../../utils/nodemailer.utils.js";
import crypto from 'crypto'

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
    await newUser.save();

    // let verification_url = `htttp://localhost:9000/verify-email/${emailVerificationToken}`;
    let verification_url = `http://localhost:5173/api/user/verify-email/${emailVerificationToken}`;

    //! send a mail -->
    await sendEmail(
        email,
        "Email Verificatipn",

        "sample text",
        `<h1> this is for verification</h1> <a href="${verification_url}">Click Here</a> <h3> ${emailVerificationToken} </h3>`
    );


    new ApiResponse(201, "User Registered Successfully", newUser).send(res);
});

export const verifyEmail = expressAsyncHandler(async (req, res, next) => {
    let { emailToken } = req.params;
    let hashedEmailToken = crypto
        .createHash("sha256")
        .update(emailToken)
        .digest("hex");

    let user = await UserModel.findOne({
        emailVerificationToken: hashedEmailToken,
        emailVerificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) next(new CustomError(400, "Token Expired"));

    if (user.isVerified) next(new CustomError(400, "User already verified"))

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    await user.save();

    new ApiResponse(200, "Email Verified Successfully").send(res);
});

export const loginUser = expressAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser = await UserModel.findOne({ email });
    if (!existingUser) next(new CustomError(400, "Email Not Found!!!"));

    let matchPassword = await existingUser.comparePassword(password);
    if (!matchPassword) {
        // throw new CustomError(401, "Password Not Matched");
        return next(new CustomError(401, "Password Not Matched"));
    }

    //! is isVerified is set to true
    if (!existingUser.isVerified) return next(new CustomError(400, "Email is not verified"))

    let token = generateToken(existingUser._id)
    console.log(token);

    res.cookie("token", token, {
        maxAge: process.env.JWT_TOKEN_EXPIRY * 60 * 60 * 1000, //? pass expiration time in milliseconds (1hr)
        httpOnly: true, //? this cookie will only be accessible by the server not by browser (for security purpose)
    })

    new ApiResponse(200, "User Logged In Successfully").send(res);
});

export const resendEmailVerificationLink = expressAsyncHandler(async (req, res, next) => {
    let { email } = req.body;

    let existingUser = await UserModel.findOne({ email })

    if (!existingUser) next(new CustomError(400, "user not found"))

    if (existingUser.isVerified) next(new CustomError(400, "Email already verified"))

    let emailVerificationToken = existingUser.generateEmailVerificationToken();
    await existingUser.save();

    // let verification_url = `htttp://localhost:9000/verify-email/${emailVerificationToken}`;
    let verification_url = `http://localhost:5173/api/user/verify-email/${emailVerificationToken}`;

    //! send a mail -->
    await sendEmail(
        email,
        "Email Verificatipn",
        "Resend VErification Email ",
        `<h1> this is for verification</h1> <a href="${verification_url}">Click Here</a> <h3> ${emailVerificationToken} </h3>`
    );

    new ApiResponse(200, "Email verification sent successfully").send(res)
})

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

    new ApiResponse(200, "Password Updated Successfully").send(res)
});

export const forgotPassword = expressAsyncHandler(async (req, res, next) => {
    const { email } = req.body;
    let existingUser = await UserModel.findOne({ email })

    if (!existingUser) next(new CustomError(400, "Email not found"))

    let resetPasswordToken = existingUser.generateResetPasswordToken();
    await existingUser.save();

    let resetPassword_url = `http://localhost:5173/api/user/reset-password/${resetPasswordToken}`

    await sendEmail(
        email,
        "Reset Password",
        "Reset Password ",
        `<h1> this is for verification</h1> <a href="${resetPassword_url}">Click Here</a> <h3> ${resetPasswordToken} </h3>`
    );

    new ApiResponse(200, "Reset password link send to email").send(res)
});

export const resetPassword = expressAsyncHandler(async (req, res, next) => {
    const {resetPasswordToken} = req.params;
    let resetPasswordTokenHashed = crypto
        .createHash("sha256")
        .update(resetPasswordToken)
        .digest("hex")

    const existingUser = await UserModel.findOne({
        passwordResetToken:resetPasswordTokenHashed,
        passwordResetTokenExpiry : {$gt : Date.now()},
    })
    if(!existingUser) next(new CustomError(400, "Token Expired"))

    existingUser.password = req.body.password
    await existingUser.save();

    new ApiResponse(200, "Password reset Successfully").send(res)
});

//! login, logout -> (token generation), authenticate middleware