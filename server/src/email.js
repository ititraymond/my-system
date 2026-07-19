// Resend via REST API (works on Railway — no SMTP port block)

const RESEND_API = 'https://api.resend.com/emails'

export async function sendEmail({ to, subject, html }) {
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
  return { messageId: data.id }
}
