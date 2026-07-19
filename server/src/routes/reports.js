import { Router } from 'express'
import db from '../db.js'
import { authMiddleware } from '../auth.js'

const router = Router()

// ── Login duration by user & date ──
router.get('/login-duration', authMiddleware, async (req, res) => {
  const rows = await db('sessions')
    .join('users', 'sessions.user_id', 'users.id')
    .select(
      'users.username',
      db.raw("date(sessions.login_at) as date"),
      db.raw("count(*) as sessions"),
      db.raw("round(avg(cast((julianday(coalesce(sessions.logout_at, 'now')) - julianday(sessions.login_at)) * 24 * 60 as real)), 1) as avg_minutes"),
      db.raw("round(sum(cast((julianday(coalesce(sessions.logout_at, 'now')) - julianday(sessions.login_at)) * 24 * 60 as real)), 1) as total_minutes")
    )
    .groupBy('users.username', db.raw("date(sessions.login_at)"))
    .orderBy('date', 'desc')
    .orderBy('users.username')

  res.json(rows)
})

export default router
