import { Router } from 'express'
import db from '../db.js'
import { authMiddleware } from '../auth.js'

const router = Router()

// ── Get logs (latest 100) ──
router.get('/', authMiddleware, async (req, res) => {
  const logs = await db('logs')
    .leftJoin('users', 'logs.user_id', 'users.id')
    .select('logs.*', 'users.username')
    .orderBy('logs.created_at', 'desc')
    .limit(100)
  res.json(logs.map(l => ({
    id: l.id,
    username: l.username || 'system',
    action: l.action,
    details: l.details,
    created_at: l.created_at,
  })))
})

export default router
