import nodemailer from 'nodemailer';

// Create transporter (configure based on your email service)
const createTransporter = () => {
  // For development, you can use Gmail, SendGrid, AWS SES, etc.
  // This example uses SMTP configuration from environment variables
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // If SMTP is not configured, log the email instead
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('=== EMAIL NOTIFICATION (SMTP not configured) ===');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Body:', html || text);
      console.log('===============================================');
      return { success: true, message: 'Email logged (SMTP not configured)' };
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html: html || text,
      text: text || html?.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

