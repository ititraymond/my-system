import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import logRoutes from './routes/logs.js'
import emailRoutes from './routes/email.js'
import reportRoutes from './routes/reports.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001
const isProd = process.env.NODE_ENV === 'production'

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/logs', logRoutes)
app.use('/api/email', emailRoutes)
app.use('/api/reports', reportRoutes)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Serve React build in production
if (isProd) {
  const clientDist = path.resolve(__dirname, '../../client/dist')
  app.use(express.static(clientDist))
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
