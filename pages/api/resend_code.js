import { nanoid } from "nanoid";
import axios from "axios";
import election_db from "../../database/CreateConnection.js";
import nodemailer from "nodemailer";
import send_email from "../../utilities/SendEmail.js";
const format_email_message = (code) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style type="text/css">
        /* Inline styles work best for email clients */
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 20px;
          background-color: #f7f7f7;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          max-width: 150px;
        }
        .code-box {
          background: #f5f5f5;
          border: 2px dashed #cccccc;
          padding: 15px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 3px;
          color: #333333;
          margin: 20px 0;
          border-radius: 5px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #4CAF50;
          color: white !important;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #999999;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://yourwebsite.com/logo.png" alt="Your App Logo" class="logo">
          <h1>Verify Your Email Address</h1>
        </div>
        
        <p>Hello,</p>
        
        <p>Thank you for registering with us. Please use the following verification code to complete your registration:</p>
        
        <div class="code-box">${code}</div>
        
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          <p>
            <a href="https://yourwebsite.com" style="color: #999999;">Our Website</a> | 
            <a href="https://yourwebsite.com/privacy" style="color: #999999;">Privacy Policy</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
export default async function handle(req, res) {
  switch (req.method) {
    case "PATCH": {
      const { email } = req.body;
      const decoded_email = decodeURIComponent(email.replace("%20", "+"));
      const [user] = await election_db.query(
        "SELECT * FROM users WHERE email=?",
        [decoded_email]
      );

      if (user.length > 0) {
        const code = nanoid(6);
        const expiry_time = new Date(Date.now() + 5 * 60 * 1000);
        await election_db.query(
          "UPDATE users set verification_code=?, expiry_date=? where email=?",
          [code, expiry_time, decoded_email]
        );
        send_email(
          decoded_email,
          "Email Verification",
          format_email_message(code)
        );
        res
          .status(201)
          .json({
            message: "Code has been resent to your email",
            success: true,
          });
      } else {
        res
          .status(400)
          .json({ message: "Email does not exist", success: false });
      }
    }
  }
}
