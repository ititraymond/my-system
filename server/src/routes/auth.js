import { Router } from 'express'
import bcrypt from 'bcryptjs'
import db from '../db.js'
import { generateToken, authMiddleware } from '../auth.js'

const router = Router()

// ── Register ──
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' })
  }
  try {
    const hash = await bcrypt.hash(password, 10)
    const [user] = await db('users').insert({ username, email, password_hash: hash }).returning('*')
    const token = generateToken(user)
    res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } })
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Username or email already taken' })
    }
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Login ──
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing fields' })
  }
  const user = await db('users').where({ username }).first()
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

  const token = generateToken(user)
  res.json({ token, user: { id: user.id, username: user.username, email: user.email } })
})

// ── Me (protected) ──
router.get('/me', authMiddleware, async (req, res) => {
  const user = await db('users').where({ id: req.user.id }).first()
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ id: user.id, username: user.username, email: user.email })
})

export default router
