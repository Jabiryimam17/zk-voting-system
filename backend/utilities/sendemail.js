import nodemailer from "nodemailer";

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

async function fetch_with_timeout(url, options, timeout_ms = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeout_ms);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        connection: "close",
        ...options.headers,
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function send_via_brevo_smtp(recipient, subject, html) {
  const smtpKey = process.env.BREVO_SMTP_KEY;
  const smtpUser = process.env.BREVO_SMTP_USER;
  const sender = process.env.EMAIL_SENDER;

  if (!smtpKey || !smtpUser) {
    console.warn(
      "BREVO_SMTP_KEY or BREVO_SMTP_USER is missing. Brevo SMTP send skipped.",
    );
    return null;
  }
  if (!sender) {
    throw new Error("EMAIL_SENDER is not configured");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpKey,
    },
  });

  const info = await transporter.sendMail({
    from: `"ZK Voting System" <${sender}>`,
    to: recipient,
    subject: subject,
    html: html,
  });

  console.log("Email sent successfully via Brevo SMTP:", info.messageId);
  return info.messageId;
}

async function send_via_brevo_api(recipient, subject, html) {
  const apiKey = process.env.BREVO_API_KEY;
  const sender = process.env.EMAIL_SENDER;

  if (!apiKey) {
    // We don't warn here anymore as we prefer SMTP
    return null;
  }
  if (!sender) {
    throw new Error("EMAIL_SENDER is not configured");
  }

  const response = await fetch_with_timeout(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "ZK Voting System", email: sender },
        to: [{ email: recipient }],
        subject,
        htmlContent: html,
      }),
    },
  );

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${body}`);
  }

  console.log("Email sent successfully via Brevo API:", body);
  return body;
}

async function send_via_email_service(recipient, code) {
  const host = process.env.EMAIL_SERVICE_HOST;
  if (!host) {
    return null;
  }

  const response = await fetch_with_timeout(`${host}/send_verification_email`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: recipient, code }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Email service HTTP ${response.status}: ${body}`);
  }

  console.log("Email sent successfully via email service:", body);
  return body;
}

export async function send_email(recipient, subject, html, code = null) {
  if (code) {
    console.log(
      `--- [EMAIL SENDER] Verification code for ${recipient} is: ${code} ---`,
    );
  }

  // 1. Try Brevo REST API first (User requested direct Vercel -> Brevo)
  if (process.env.BREVO_API_KEY) {
    try {
      return await send_via_brevo_api(recipient, subject, html);
    } catch (apiError) {
      console.error("Brevo API failed, trying fallbacks:", apiError.message);
    }
  }

  // 2. Fallback to hosted service proxy (Railway)
  if (process.env.EMAIL_SERVICE_HOST && code) {
    try {
      return await send_via_email_service(recipient, code);
    } catch (proxyError) {
      console.error("Email service proxy failed:", proxyError.message);
    }
  }

  // 3. Last resort: SMTP (known to timeout on Vercel)
  if (process.env.BREVO_SMTP_KEY) {
    return send_via_brevo_smtp(recipient, subject, html);
  }

  throw new Error("No email delivery method configured or all methods failed");
}

export default send_email;
