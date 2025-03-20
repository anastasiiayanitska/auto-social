import nodemailer from 'nodemailer';

// Створення транспорту для відправки повідомлень
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: `"Your service" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    // console.log(`Електронний лист надіслано на ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Шаблони електронних листів
export const getRegistrationEmailTemplate = (
  username: string,
  verificationCode: string,
): string => {
  return `
    <h1>Hallo, ${username}!</h1>
    <p>Thank you for registering with our service.</p>
<p>Please enter this code to confirm your email address:</p>
<div style="padding: 15px; background-color: #f4f4f4; border-radius: 5px; font-size: 24px; text-align: center; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
${verificationCode}
</div>
<p>The code is valid for 30 minutes.</p>
<p>If you have not registered, please ignore this email.</p>
`;
};

export const getPasswordResetEmailTemplate = (
  username: string,
  resetCode: string,
): string => {
  return `
   <h1>Hello, ${username}!</h1>
    <p>You received this email because you requested a password reset.</p>
    <p>To reset your password, use this code:</p>
    <div style="padding: 15px; background-color: #f4f4f4; border-radius: 5px; font-size: 24px; text-align: center; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
    ${resetCode}
    </div>
    <p>The code is valid for 30 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
    `;
};

export const getPasswordChangeEmailTemplate = (
  username: string,
  verificationCode?: string,
): string => {
  if (verificationCode) {
    return `
      <h1>Hello, ${username}!</h1>
      <p>You have requested a password change.</p>
      <p>To confirm your password change, use this code:</p>
      <div style="padding: 15px; background-color: #f4f4f4; border-radius: 5px; font-size: 24px; text-align: center; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
      ${verificationCode}
      </div>
      <p>The code is valid for 30 minutes.</p>
      <p>If you did not make this request, please contact support immediately.</p>
          `;
  } else {
    return `
     <h1>Hello, ${username}!</h1>
      <p>Your password has been successfully changed.</p>
      <p>If you did not make this change, please contact support immediately.</p>
    `;
  }
};
