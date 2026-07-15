import SibApiV3Sdk from "sib-api-v3-sdk";

export const format_email_message = (code) => {
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
export async function send_email(recipient, subject, html) {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;

  // Configure API key authorization: api-key
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  sendSmtpEmail.sender = { email: process.env.EMAIL_SENDER };
  sendSmtpEmail.to = [{ email: recipient }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return data;
  } catch (error) {
    console.error("Error sending email via Brevo SDK:", error);
    throw error;
  }
}
export default send_email;
