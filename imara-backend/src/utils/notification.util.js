const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  const message = {
    from: `${process.env.FROM_NAME || 'IMARA'} <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  // Send email
  const info = await transporter.sendMail(message);

  console.log('Email sent: ' + info.messageId);
};

const getWelcomeEmailTemplate = (name) => {
  return {
    subject: 'Welcome to IMARA! 🌟',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f59e0b; margin: 0;">Welcome to IMARA</h1>
          <p style="color: #6b7280; margin: 10px 0;">Your journey to wellness starts now</p>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #92400e; margin-top: 0;">Hello ${name}!</h2>
          <p style="color: #78350f; line-height: 1.6;">
            Thank you for joining IMARA! We're excited to support you on your wellness journey. 
            Here's what you can do to get started:
          </p>
          <ul style="color: #78350f; line-height: 1.8;">
            <li>Complete your first daily check-in</li>
            <li>Explore our guided paths</li>
            <li>Join the community for support</li>
            <li>Set up your first habit</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL}" 
             style="background: #f59e0b; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Get Started
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
          <p>Stability before ambition</p>
          <p>© 2024 IMARA. All rights reserved.</p>
        </div>
      </div>
    `
  };
};

const getPasswordResetTemplate = (resetUrl) => {
  return {
    subject: 'Password Reset Request - IMARA',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f59e0b; margin: 0;">Password Reset</h1>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p style="color: #78350f; line-height: 1.6;">
            You requested a password reset. Click the button below to reset your password. 
            This link will expire in 10 minutes.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${resetUrl}" 
             style="background: #f59e0b; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `
  };
};

module.exports = {
  sendEmail,
  getWelcomeEmailTemplate,
  getPasswordResetTemplate
};