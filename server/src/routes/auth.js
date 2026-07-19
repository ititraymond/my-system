import { Router } from 'express'
import bcrypt from 'bcryptjs'
import db, { logAction } from '../db.js'
import { generateToken, authMiddleware } from '../auth.js'

const router = Router()

// ── Register ──
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' })
  try {
    const hash = await bcrypt.hash(password, 10)
    const [id] = await db('users').insert({ username, email, password_hash: hash }).returning('id')
    const user = await db('users').where({ id }).first()
    await logAction(id, 'register', `${username} 註冊了新帳戶`)
    const token = generateToken(user)
    res.status(201).json({ token, user: cleanUser(user) })
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Username or email already taken' })
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Login ──
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' })
  const user = await db('users').where({ username }).first()
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    await logAction(user.id, 'login_failed', `${username} 登入失敗`)
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  if (user.must_change_password) {
    const tempToken = generateToken(user, '5m')
    return res.json({ must_change_password: true, tempToken, message: '首次登入，請更改密碼' })
  }

  await logAction(user.id, 'login', `${username} 登入了系統`)
  // Track session
  const [sessionId] = await db('sessions').insert({ user_id: user.id, login_at: db.fn.now() }).returning('id')
  const token = generateToken({ ...user, sessionId })
  res.json({ token, user: cleanUser(user) })
})

// ── Change Password ──
router.post('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: '新密碼至少6個字元' })

  const user = await db('users').where({ id: req.user.id }).first()
  if (!user) return res.status(404).json({ error: 'User not found' })

  if (!user.must_change_password) {
    if (!currentPassword) return res.status(400).json({ error: '請輸入目前密碼' })
    const valid = await bcrypt.compare(currentPassword, user.password_hash)
    if (!valid) return res.status(401).json({ error: '目前密碼錯誤' })
  }

  const hash = await bcrypt.hash(newPassword, 10)
  await db('users').where({ id: user.id }).update({ password_hash: hash, must_change_password: false })
  await logAction(user.id, 'change_password', `${user.username} 更改了密碼`)
  const token = generateToken(user)
  res.json({ token, user: cleanUser({ ...user, must_change_password: false }), message: '密碼已更改 ✅' })
})

// ── Me (protected) ──
router.get('/me', authMiddleware, async (req, res) => {
  const user = await db('users').where({ id: req.user.id }).first()
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(cleanUser(user))
})

// ── Logout ──
router.post('/logout', authMiddleware, async (req, res) => {
  const sessionId = req.user.sessionId
  if (sessionId) {
    await db('sessions').where({ id: sessionId }).update({ logout_at: db.fn.now() })
  }
  await logAction(req.user.id, 'logout', `${req.user.username} 登出了系統`)
  res.json({ success: true })
})

function cleanUser(u) {
  return { id: u.id, username: u.username, email: u.email, must_change_password: !!u.must_change_password }
}

export default router
