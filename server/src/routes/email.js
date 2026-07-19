import { Router } from 'express'
import { authMiddleware } from '../auth.js'
import { sendEmail } from '../email.js'
import db from '../db.js'

const router = Router()

router.post('/test', authMiddleware, async (req, res) => {
  const { to, subject, body } = req.body
  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing fields: to, subject, body' })
  }
  try {
    const result = await sendEmail({
      to, subject,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2>📧 ${subject}</h2>
        <p>${body}</p>
        <hr style="border-color:#eee;margin:24px 0">
        <p style="color:#999;font-size:12px">由 System A 透過 Resend 發送</p>
      </div>`,
      userId: req.user.id,
    })
    res.json({ success: true, messageId: result.messageId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Email history ──
router.get('/history', authMiddleware, async (req, res) => {
  const logs = await db('email_logs')
    .join('users', 'email_logs.user_id', 'users.id')
    .select('email_logs.*', 'users.username')
    .orderBy('email_logs.sent_at', 'desc')
    .limit(100)
  res.json(logs)
})

export default router
