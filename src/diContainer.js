'use strict'

const awilix = require('awilix')
const BookingRepository = require('./repositories/bookingRepository')
const HereApiHandler = require('./api/HereApiHandler')
const knex = require('./db')

const container = awilix.createContainer()

container.register({
  bookingRepository: awilix.asValue(BookingRepository),
  apiHandler: awilix.asValue(HereApiHandler),
  db: awilix.asValue(knex)
})

container
  .resolve('apiHandler')
  .config(process.env.API_APP_ID, process.env.API_APP_KEY)

module.exports = container
