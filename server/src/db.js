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

// Auto-create tables
await db.schema.hasTable('users').then(async exists => {
  if (!exists) {
    await db.schema.createTable('users', t => {
      t.increments('id').primary()
      t.string('username').unique().notNullable()
      t.string('email').unique().notNullable()
      t.string('password_hash').notNullable()
      t.boolean('must_change_password').defaultTo(false)
      t.timestamps(true, true)
    })
    // Seed default admin
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin', 10)
    await db('users').insert({
      username: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@localhost',
      password_hash: hash,
      must_change_password: true
    })
    console.log('✅ Default admin created (admin / admin) — must change password on first login')
  }
})

export default db
