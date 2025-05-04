import nodemailer from 'nodemailer';
import env from 'dotenv';
env.config();

const mailConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

function getDefaultTemplate(name, message, link) {
  return `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Xin chào ${name},</h2>
      <p>${message}</p>
      ${link ? `<p><a href="${link}" target="_blank">Nhấn vào đây để tiếp tục</a></p>` : ""}
      <p style="color: gray; font-size: 12px;">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    </div>
  `;
}

export const mailService = {
  async sendMail(emailTo, subject, plainText, options = {}) {
    try {
      const transporter = nodemailer.createTransport(mailConfig);

      const html = getDefaultTemplate(
        options.name || 'bạn',
        options.message || plainText,
        options.link || ''
      );

      const info = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: emailTo,
        subject:'Yêu cầu cấp lại mật kh',
        text: plainText,
        html
      });

      console.log('Email gửi thành công:', info.response);
      return info;
    } catch (err) {
      console.error('Lỗi gửi mail:', err.message, err.stack);
      throw new Error(`Không thể gửi email: ${err.message}`);
    }
  }
};