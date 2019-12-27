import nodemailer, { SentMessageInfo } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

// Replace with your preferable SMTP server, port, account, and password
// You can also use OAuth2 token for better security
// See https://nodemailer.com/smtp/ for details of how to configure
const SMTP_SERVER: string = "smtp-mail.outlook.com";
const SMTP_PORT: number = 587;
const SMTP_AUTH_ACCOUNT = "<your_account>@outlook.com";
const SMTP_AUTH_PASSWORD = "<your_password>";

const mailer: Mail = nodemailer.createTransport({
    host: SMTP_SERVER,
    secure: false,
    port: SMTP_PORT,
    tls: {
       ciphers: "SSLv3"
    },
    auth: {
        user: SMTP_AUTH_ACCOUNT,
        pass: SMTP_AUTH_PASSWORD
    }
});

export const sendEmail = (to: string, subject: string, content: string): Promise<SentMessageInfo> => {
    const mailOptions: Mail.Options = {
        to: to,
        from: SMTP_AUTH_ACCOUNT,
        subject: subject,
        text: content
    };
    return mailer.sendMail(mailOptions);
};