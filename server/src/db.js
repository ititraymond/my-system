// Database — SQLite now, PostgreSQL later (just swap this file)

import knex from 'knex'
import dotenv from 'dotenv'
dotenv.config()

const db = knex({
  client: 'better-sqlite3',
  connection: {
    filename: './data/db.sqlite'
  },
  useNullAsDefault: true,
  // PostgreSQL migration — just change to:
  // client: 'pg',
  // connection: process.env.DATABASE_URL
})

// Ensure tables exist
db.schema.hasTable('users').then(exists => {
  if (!exists) {
    return db.schema.createTable('users', t => {
      t.increments('id').primary()
      t.string('username').unique().notNullable()
      t.string('email').unique().notNullable()
      t.string('password_hash').notNullable()
      t.timestamps(true, true)
    })
  }
})

export default db
