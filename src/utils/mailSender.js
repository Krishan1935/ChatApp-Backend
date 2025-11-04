import transporter from "../config/nodemailer.js";

async function sendMail(to, subject, html) {
    try {
        const mail = await transporter.sendMail({
            from: '"Pictogram" <krishandevelops@gmail.com',
            to,
            subject,
            html
        });

        return mail;
    } catch (error) {
        console.log("Cant send mail: ", error);
    }
}

export default sendMail;