import nodemailer from 'nodemailer';
import 'dotenv/config';  // Load .env

async function send_email(recipient, subject, html) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.APP_PASSWORD
        }
    });
    await transporter.sendMail({
        from: process.env.EMAIL_SENDER,
        to: recipient,
        subject: subject,
        html:html
    });
}
export default send_email;
