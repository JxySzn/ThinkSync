import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function sendVerificationEmail(email: string, otp: string) {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM || "byronjason902@gmail.com",
    subject: "Your Scholarly Verification Code",
    text: `Your verification code is: ${otp}`,
    html: `<strong>Your verification code is: ${otp}</strong>`,
  };
  await sgMail.send(msg);
}
