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
    t.string('action').notNullable()       // e.g. 'login', 'change_password', 'register'
    t.text('details').nullable()            // e.g. 'admin logged in from IP x'
    t.timestamp('created_at').defaultTo(db.fn.now())
  })
  console.log('✅ Logs table created')
}

// ── Log helper ──
export async function logAction(userId, action, details = null) {
  await db('logs').insert({ user_id: userId, action, details })
}

export default db
