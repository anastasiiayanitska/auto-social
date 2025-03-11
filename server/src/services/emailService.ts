// import nodemailer from 'nodemailer';

// // Створення транспорту для відправки повідомлень
// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE || 'gmail', // Наприклад: 'gmail', 'sendgrid', 'mailgun'
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// export const sendEmail = async (
//   to: string,
//   subject: string,
//   html: string,
// ): Promise<boolean> => {
//   try {
//     await transporter.sendMail({
//       from: `"Ваш сервіс" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });
//     console.log(`Електронний лист надіслано на ${to}`);
//     return true;
//   } catch (error) {
//     console.error('Помилка відправки електронного листа:', error);
//     return false;
//   }
// };

// // Шаблони електронних листів
// export const getRegistrationEmailTemplate = (
//   username: string,
//   verificationToken: string,
// ): string => {
//   const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

//   return `
//     <h1>Вітаємо, ${username}!</h1>
//     <p>Дякуємо за реєстрацію у нашому сервісі.</p>
//     <p>Будь ласка, підтвердіть вашу електронну адресу, натиснувши на це посилання:</p>
//     <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Підтвердити електронну адресу</a>
//     <p>Якщо ви не реєструвалися, проігноруйте цей лист.</p>
//   `;
// };

// export const getPasswordResetEmailTemplate = (
//   username: string,
//   resetToken: string,
// ): string => {
//   const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//   return `
//     <h1>Привіт, ${username}!</h1>
//     <p>Ви отримали цей лист, тому що зробили запит на відновлення пароля.</p>
//     <p>Для встановлення нового пароля перейдіть за посиланням:</p>
//     <a href="${resetUrl}" style="padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px;">Встановити новий пароль</a>
//     <p>Посилання дійсне протягом 1 години.</p>
//     <p>Якщо ви не робили цього запиту, проігноруйте цей лист.</p>
//   `;
// };

// export const getPasswordChangeEmailTemplate = (username: string): string => {
//   return `
//     <h1>Привіт, ${username}!</h1>
//     <p>Ваш пароль було успішно змінено.</p>
//     <p>Якщо ви не робили цієї зміни, негайно зверніться до служби підтримки.</p>
//   `;
// };
import nodemailer from 'nodemailer';

// Створення транспорту для відправки повідомлень
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail', // Наприклад: 'gmail', 'sendgrid', 'mailgun'
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
      from: `"Ваш сервіс" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Електронний лист надіслано на ${to}`);
    return true;
  } catch (error) {
    console.error('Помилка відправки електронного листа:', error);
    return false;
  }
};

// Шаблони електронних листів
export const getRegistrationEmailTemplate = (
  username: string,
  verificationCode: string,
): string => {
  return `
    <h1>Вітаємо, ${username}!</h1>
    <p>Дякуємо за реєстрацію у нашому сервісі.</p>
    <p>Будь ласка, введіть цей код для підтвердження вашої електронної адреси:</p>
    <div style="padding: 15px; background-color: #f4f4f4; border-radius: 5px; font-size: 24px; text-align: center; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
      ${verificationCode}
    </div>
    <p>Код дійсний протягом 30 хвилин.</p>
    <p>Якщо ви не реєструвалися, проігноруйте цей лист.</p>
  `;
};

export const getPasswordResetEmailTemplate = (
  username: string,
  resetCode: string,
): string => {
  return `
    <h1>Привіт, ${username}!</h1>
    <p>Ви отримали цей лист, тому що зробили запит на відновлення пароля.</p>
    <p>Для відновлення пароля використайте цей код:</p>
    <div style="padding: 15px; background-color: #f4f4f4; border-radius: 5px; font-size: 24px; text-align: center; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
      ${resetCode}
    </div>
    <p>Код дійсний протягом 30 хвилин.</p>
    <p>Якщо ви не робили цього запиту, проігноруйте цей лист.</p>
  `;
};

export const getPasswordChangeEmailTemplate = (
  username: string,
  verificationCode?: string,
): string => {
  if (verificationCode) {
    return `
      <h1>Привіт, ${username}!</h1>
      <p>Ви зробили запит на зміну пароля.</p>
      <p>Для підтвердження зміни пароля використайте цей код:</p>
      <div style="padding: 15px; background-color: #f4f4f4; border-radius: 5px; font-size: 24px; text-align: center; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        ${verificationCode}
      </div>
      <p>Код дійсний протягом 30 хвилин.</p>
      <p>Якщо ви не робили цього запиту, негайно зверніться до служби підтримки.</p>
    `;
  } else {
    return `
      <h1>Привіт, ${username}!</h1>
      <p>Ваш пароль було успішно змінено.</p>
      <p>Якщо ви не робили цієї зміни, негайно зверніться до служби підтримки.</p>
    `;
  }
};
