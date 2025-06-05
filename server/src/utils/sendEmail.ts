import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailParams) => {
  const msg = {
    to,
    from: process.env.FROM_EMAIL || '', 
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent to', to);
  } catch (error: any) {
    console.error('SendGrid Error:', error?.response?.body || error.message);
  }
};
