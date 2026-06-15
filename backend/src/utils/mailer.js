import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTP = async (to, otp) => {
  await resend.emails.send({
    from: process.env.RESEND_FROM,
    to,
    subject: "Your OTP - We Talk",
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: auto; padding: 2rem; background: #1e1b2e; border-radius: 12px; color: #eee;">
        <h2 style="color: #7c6af7; margin-bottom: 0.5rem;">We Talk</h2>
        <p style="color: #aaa; margin-bottom: 1.5rem;">Password reset OTP</p>
        <div style="font-size: 2.5rem; font-weight: bold; color: #7c6af7; letter-spacing: 10px; margin: 1rem 0; text-align: center;">
          ${otp}
        </div>
        <p style="color: #888; font-size: 0.85rem; margin-top: 1.5rem;">
          Valid for <strong style="color: #aaa;">10 minutes</strong>. Do not share with anyone.
        </p>
      </div>
    `,
  });
};