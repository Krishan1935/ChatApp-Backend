// packages
import bcrypt from "bcrypt";

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
            res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const hashedPassword = await bcrypt.hash(password, HASH_ROUNDS);

        let user, profile;
        try {
            user = new USERS({
                email,
                password: hashedPassword,
            });
            await user.save();

            profile = new PROFILES({
                fullname,
                username,
                user_id: user._id,
            });
            await profile.save();
        } catch (error) {
            console.log("ERROR IN CREATING USER AND PROFILE: ", error.errors.name);
            if (error.name === 'ValidationError') {
                return res.status(401).json({
                    success: false,
                    message: error.errors?.email?.properties?.message ? error.errors.email.properties.message : error.errors?.username?.properties?.message
                })
            }
        }

        const token = user.token;
        try {
            const mail = await sendMail(user.email, 'Email Verification', `Click on this link to verify your email: localhost:4567/auth/verify-email/${token.split(" ").join("-")}`);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Can't send mail. Please try again"
            })
        }

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