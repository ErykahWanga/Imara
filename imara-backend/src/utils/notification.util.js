const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send email notification
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.text
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Email templates
const emailTemplates = {
  welcome: (user) => ({
    subject: 'Welcome to IMARA!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to IMARA</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Stability before ambition</p>
        </div>
        <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Hi ${user.name},</p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Welcome to IMARA! We're so glad you're here.</p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">IMARA is designed to help you build stability through small, consistent steps. Here's how to get started:</p>
          <ul style="font-size: 16px; color: #333; line-height: 1.6; padding-left: 20px;">
            <li>Start with daily check-ins to build consistency</li>
            <li>Explore guided paths for step-by-step support</li>
            <li>Join community challenges for extra motivation</li>
            <li>Track your progress and celebrate small wins</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
          </div>
          <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            Remember: You are not behind. You are here. That is what matters.
          </p>
        </div>
      </div>
    `,
    text: `Welcome to IMARA! Hi ${user.name}, welcome to IMARA. Get started at ${process.env.FRONTEND_URL}`
  }),
  
  reminder: (reminder) => ({
    subject: `IMARA Reminder: ${reminder.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">⏰ Reminder</h2>
        </div>
        <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; color: #333; font-weight: bold; margin-bottom: 20px;">${reminder.title}</p>
          ${reminder.description ? `<p style="font-size: 16px; color: #666; margin-bottom: 20px;">${reminder.description}</p>` : ''}
          <p style="font-size: 14px; color: #999; margin-top: 30px;">
            You can manage your reminders in the IMARA app.
          </p>
        </div>
      </div>
    `,
    text: `IMARA Reminder: ${reminder.title} - ${reminder.description || ''}`
  }),
  
  achievement: (achievement, user) => ({
    subject: `🎉 Achievement Unlocked: ${achievement.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🏆 Achievement Unlocked!</h1>
        </div>
        <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 48px; margin-bottom: 10px;">${achievement.icon}</div>
            <h2 style="color: #f59e0b; margin: 10px 0;">${achievement.title}</h2>
            <p style="color: #666; font-size: 16px;">${achievement.description}</p>
          </div>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Congratulations ${user.name}! You've earned ${achievement.points} points for this achievement.</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #666; font-size: 14px;">Keep going! Small steps lead to big changes.</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/achievements" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View All Achievements</a>
          </div>
        </div>
      </div>
    `,
    text: `Achievement Unlocked: ${achievement.title} - ${achievement.description} - You earned ${achievement.points} points!`
  }),
  
  challengeProgress: (challenge, user, progress) => ({
    subject: `📊 Challenge Update: ${challenge.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">🎯 Challenge Update</h2>
        </div>
        <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; color: #333; font-weight: bold; margin-bottom: 10px;">${challenge.title}</p>
          <p style="font-size: 16px; color: #666; margin-bottom: 20px;">${challenge.description}</p>
          
          <div style="margin: 30px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-size: 14px; color: #666;">Progress</span>
              <span style="font-size: 14px; color: #666; font-weight: bold;">${progress}%</span>
            </div>
            <div style="height: 10px; background: #e5e7eb; border-radius: 5px; overflow: hidden;">
              <div style="height: 100%; background: #3b82f6; width: ${progress}%; border-radius: 5px;"></div>
            </div>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Great work, ${user.name}! You're making progress in the "${challenge.title}" challenge.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/challenges" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Continue Challenge</a>
          </div>
        </div>
      </div>
    `,
    text: `Challenge Update: ${challenge.title} - Progress: ${progress}% - ${challenge.description}`
  })
};

// Send push notification (simulated - in production use Firebase Cloud Messaging)
const sendPushNotification = async (userId, title, body, data = {}) => {
  console.log(`Push notification to user ${userId}: ${title} - ${body}`);
  // In production: Integrate with FCM, APNs, or Expo
  return true;
};

module.exports = {
  sendEmail,
  emailTemplates,
  sendPushNotification
};