import nm from "nodemailer";
import { configDotenv } from "dotenv";
configDotenv();

const transporter = nm.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export default transporter;