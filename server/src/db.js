// Database — SQLite now, PostgreSQL later (just swap this file)

import knex from 'knex'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
dotenv.config()

const db = knex({
  client: 'better-sqlite3',
  connection: { filename: './data/db.sqlite' },
  useNullAsDefault: true,
})

const DATA_WIPE_KEY = process.env.removeAllData1234

// ── Safety check: only wipe data if exact key matches ──
if (DATA_WIPE_KEY === 'Abcd!@#$1234') {
  console.log('⚠️  WIPE KEY MATCHED — dropping all tables...')
  await db.schema.dropTableIfExists('logs')
  await db.schema.dropTableIfExists('users')
  console.log('🗑️  All data cleared')
} else if (DATA_WIPE_KEY) {
  console.log(`⚠️  removeAllData1234 is set but value does NOT match. Data preserved.`)
}

// ── Auto-create tables ──
const hasUsers = await db.schema.hasTable('users')
const hasLogs = await db.schema.hasTable('logs')

if (!hasUsers) {
  await db.schema.createTable('users', t => {
    t.increments('id').primary()
    t.string('username').unique().notNullable()
    t.string('email').unique().notNullable()
    t.string('password_hash').notNullable()
    t.boolean('must_change_password').defaultTo(false)
    t.timestamps(true, true)
  })
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin', 10)
  await db('users').insert({
    username: 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@localhost',
    password_hash: hash,
    must_change_password: true
  })
  console.log('✅ Default admin created')
}

if (!hasLogs) {
  await db.schema.createTable('logs', t => {
    t.increments('id').primary()
    t.integer('user_id').references('id').inTable('users').nullable()
    t.string('action').notNullable()
    t.text('details').nullable()
    t.timestamp('created_at').defaultTo(db.fn.now())
  })
  console.log('✅ Logs table created')
}

// ── Log helper ──
export async function logAction(userId, action, details = null) {
  await db('logs').insert({ user_id: userId, action, details })
}

export default db
