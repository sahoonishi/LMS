import nodemailer,{Transporter} from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

interface EmailOptions {
  email:string;
  subject:string;
  template:string;
  data:{[key:string]:any};
}

const sendMail = ()=>{
  
  // const transporter: Transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: Number(process.env.SMTP_PORT),
  //   secure: true,
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS,
  //   },
  // });

  // return async (options: EmailOptions) => {
  //   const { email, subject, template, data } = options;
  //   const html = await ejs.renderFile(path.join(__dirname, `../mails/${template}.ejs`), data);
    
  //   const mailOptions = {
  //     from: process.env.SMTP_USER,
  //     to: email,
  //     subject,
  //     html,
  //   };

  //   await transporter.sendMail(mailOptions);
  // };
}