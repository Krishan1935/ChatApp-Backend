// packages
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

//models
import USERS from "../models/Users.js";
import PROFILES from "../models/Profile.js";

//dotenv
import { configDotenv } from "dotenv";
import sendMail from "../utils/mailSender.js";
configDotenv();

const HASH_ROUNDS = Number(process.env.HASH_ROUNDS);


export const SignUp = async (req, res) => {
    try {
        console.log("Body: ", req.body);
        const { fullname, username, email, password } = req.body;

        if (!fullname || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const hashedPassword = await bcrypt.hash(password, HASH_ROUNDS);

        let user, profile, jwtToken, payload;
        try {
            payload = {
                email,
                token: randomUUID(),
            };
            jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '24h'
            })
            user = new USERS({
                email,
                password: hashedPassword,
                token: payload.token
            });
            await user.save();

            profile = new PROFILES({
                fullname,
                username,
                user_id: user._id,
            });
            await profile.save();
        } catch (error) {
            console.log("ERROR IN CREATING USER AND PROFILE: ", error.errors?.name);
            if (error.name === 'ValidationError') {
                return res.status(401).json({
                    success: false,
                    message: error.errors?.email?.properties?.message ? error.errors.email.properties.message : error.errors?.username?.properties?.message
                })
            }
        }

        try {
            const urlSafeToken = encodeURIComponent(payload.token);
            await sendMail(user.email, 'Email Verification', `Click on this link to verify your email: localhost:4567/auth/verify-email/${urlSafeToken}`);
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false,
                message: "Can't send mail. Please try again"
            })
        }

        const cookieOptions = {
            maxAge: 24*60*60*1000,
            httpOnly: true,
            secure: false,
        }

        res.cookie('verify-token', jwtToken, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Message sent! Please check your mails"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

export const verifyEmail = async (req, res) => {
    try {
        let jwtToken = req.cookies['verify-token'];

        if (!jwtToken) {
            return res.status(400).json({
                success: false,
                message: "Token is missing!"
            })
        }

        try {
            const { email, token } = jwt.verify(jwtToken, process.env.JWT_SECRET);

            if (!email || !token) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Token Payload"
                })
            }

            const user = await USERS.findOne({ email });

            if (!user) {
                return res.status(401).json({
                    succcess: false,
                    message: "User not found"
                })
            }

            if(user.email_verified) {
                return res.status(409).json({
                    success:false,
                    message: "Email is already verified"
                })
            }

            if (user.token !== token) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Token"
                })
            }

            if (user.token_expires_at < Date.now()) {
                return res.status(401).json({
                    success: false,
                    message: "Token has expired"
                })
            }

            user.email_verified = true;
            await user.save();
            return res.status(200).json({
                success: true,
                message: "Email verified succesfully"
            })
        } catch (error) {
            console.log("ERROR IN VERIFYING TOKEN: ", error);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

    } catch (error) {
        console.log("ERROR IN PARAMS: ", error);
    }
}