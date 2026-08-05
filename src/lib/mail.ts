import nodemailer from "nodemailer";

const domain = process.env.NEXTAUTH_URL;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"SpiderNode" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Confirm your email - SpiderNode",
    html: `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a;">Verify Your Email Address</h2>
        <p style="color: #475569; line-height: 1.6;">
          Thanks for signing up for SpiderNode! Please confirm your email address by clicking the button below.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #64748b; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${confirmLink}" style="color: #3b82f6; word-break: break-all;">${confirmLink}</a>
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"SpiderNode" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your password - SpiderNode",
    html: `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a;">Reset Your Password</h2>
        <p style="color: #475569; line-height: 1.6;">
          You requested a password reset for your SpiderNode account. Click the button below to set a new password. This link will expire in 1 hour.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #64748b; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetLink}" style="color: #3b82f6; word-break: break-all;">${resetLink}</a>
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>
      </div>
    `,
  });
};
