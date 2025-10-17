import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }

  async sendEmail({ to, subject, text, html }: EmailOptions) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('Email sent successfully:', result.messageId)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Error sending email:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string) {
    const subject = 'Welcome to Apna Journey!'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to Apna Journey!</h1>
        <p>Dear ${userName},</p>
        <p>Thank you for joining Apna Journey - Gaya's premier platform for local jobs and news!</p>
        <p>You can now:</p>
        <ul>
          <li>Browse and apply for local job opportunities</li>
          <li>Stay updated with the latest news from Gaya</li>
          <li>Post job openings for your business</li>
          <li>Connect with the local community</li>
        </ul>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Best regards,<br>The Apna Journey Team</p>
      </div>
    `

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
    })
  }

  async sendJobApplicationEmail(
    applicantEmail: string,
    applicantName: string,
    jobTitle: string,
    companyName: string
  ) {
    const subject = 'Job Application Confirmation'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Application Submitted Successfully!</h1>
        <p>Dear ${applicantName},</p>
        <p>Your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been submitted successfully.</p>
        <p>We will review your application and get back to you soon. In the meantime, you can:</p>
        <ul>
          <li>Browse other job opportunities</li>
          <li>Update your profile and resume</li>
          <li>Stay updated with the latest news</li>
        </ul>
        <p>Thank you for using Apna Journey!</p>
        <p>Best regards,<br>The Apna Journey Team</p>
      </div>
    `

    return this.sendEmail({
      to: applicantEmail,
      subject,
      html,
    })
  }

  async sendJobPostedEmail(
    posterEmail: string,
    posterName: string,
    jobTitle: string
  ) {
    const subject = 'Job Posted Successfully'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Job Posted Successfully!</h1>
        <p>Dear ${posterName},</p>
        <p>Your job posting for <strong>${jobTitle}</strong> has been submitted and is pending review.</p>
        <p>Our team will review your posting and approve it if it meets our guidelines. You will be notified once it's live.</p>
        <p>In the meantime, you can:</p>
        <ul>
          <li>Browse other job opportunities</li>
          <li>Stay updated with the latest news</li>
          <li>Manage your posted jobs from your dashboard</li>
        </ul>
        <p>Thank you for using Apna Journey!</p>
        <p>Best regards,<br>The Apna Journey Team</p>
      </div>
    `

    return this.sendEmail({
      to: posterEmail,
      subject,
      html,
    })
  }

  async sendPasswordResetEmail(userEmail: string, resetToken: string) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    const subject = 'Password Reset Request'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Password Reset Request</h1>
        <p>You requested to reset your password for your Apna Journey account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The Apna Journey Team</p>
      </div>
    `

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
    })
  }
}

export default new EmailService()
