import db from './db.js'

const RESEND_API = 'https://api.resend.com/emails'

export async function sendEmail({ to, subject, html, userId }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY not configured')

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'System A <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Send failed')

  // Log to database
  if (userId) {
    await db('email_logs').insert({
      user_id: userId,
      to,
      subject,
      message_id: data.id,
    })
  }

  return { messageId: data.id }
}
