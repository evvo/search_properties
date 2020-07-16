'use strict'

require('dotenv').config()

const defaultConfig = {
  client: 'pg',
  // Required for CockroachDB
  version: process.env.DB_VERSION,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
}

module.exports = {
  development: defaultConfig,
  // Production same as development, as environment variables are taken from the environment
  production: defaultConfig
}
