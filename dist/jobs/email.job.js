"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingConfirmation = exports.sendWelcomeEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("../utils/logger");
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });
        logger_1.logger.info(`Email sent to ${to}: ${info.messageId}`);
        return info;
    }
    catch (error) {
        logger_1.logger.error('Failed to send email:', error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
const sendWelcomeEmail = async (to, name) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3B82F6, #10B981); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9fafb; }
        .button { display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 6px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to MentorHub! 🎉</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Thank you for joining MentorHub! We're excited to help you grow your career through expert mentorship.</p>
          <p>Here's what you can do next:</p>
          <ul>
            <li>Complete your profile</li>
            <li>Browse our expert mentors</li>
            <li>Book your first session</li>
            <li>Join our community</li>
          </ul>
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Get Started</a>
          </p>
        </div>
        <div class="footer">
          <p>© 2024 MentorHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
    return (0, exports.sendEmail)(to, 'Welcome to MentorHub!', html);
};
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendBookingConfirmation = async (to, name, bookingDetails) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f9fafb; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed! ✅</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Your mentorship session has been confirmed!</p>
          <div class="details">
            <p><strong>Mentor:</strong> ${bookingDetails.mentorName}</p>
            <p><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleString()}</p>
            <p><strong>Duration:</strong> ${bookingDetails.duration} minutes</p>
            <p><strong>Total:</strong> $${bookingDetails.totalAmount}</p>
          </div>
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard/bookings" class="button">View Booking</a>
          </p>
        </div>
        <div class="footer">
          <p>Need to reschedule? Contact support@mentorhub.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
    return (0, exports.sendEmail)(to, 'Session Booking Confirmed', html);
};
exports.sendBookingConfirmation = sendBookingConfirmation;
//# sourceMappingURL=email.job.js.map