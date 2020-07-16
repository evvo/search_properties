'use strict'

const configuration = require('../knexfile')[process.env.NODE_ENV || 'development']
const knex = require('knex')(configuration)

module.exports = knex
