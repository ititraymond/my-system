import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY || '',
  },
})

export async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured')
  }
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'System A <onboarding@resend.dev>',
    to,
    subject,
    html,
  })
  return { messageId: info.messageId, accepted: info.accepted }
}
