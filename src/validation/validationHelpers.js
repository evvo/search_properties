'use strict'

const { validationResult } = require('express-validator')
const moment = require('moment')
const { to } = require('await-to-js')
const camel = require('change-case-object').camel
const apiHandler = require('../diContainer').resolve('apiHandler')
const bookingRepository = require('../diContainer').resolve('bookingRepository')
const Response = require('../response')
const { messages, yearFormat } = require('../constants')

const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    return Response.validationError(res, { errors: errors.array() })
  }
}

async function isPropertyExisting (propertyId) {
  const [err] = await to(apiHandler.fetchRawProperty(propertyId))

  if (err && err.response.status !== 404) {
    console.error('apiError', err)

    return Promise.reject(new Error(messages.PROPERTY_STATUS_UNAVAILABLE))
  }

  if (err && err.response.status === 404) {
    return Promise.reject(new Error(messages.PROPERTY_NOT_FOUND))
  }

  return true
}

function isFutureDate(value) {
  const date = moment(value)
  const current = moment()

  return date > current
}

function isEndDateLaterThanStartDate (value, { req }) {
  return moment(req.body.startDate) <= moment(req.body.endDate)
}

async function isBookingPeriodAvailable (value, { req }) {
  const { propertyId, startDate, endDate } = camel(req.body)

  const [err, result] = await to(
    bookingRepository.getBookingsCountForPropertyAndPeriod(
      propertyId,
      moment(startDate).format(yearFormat),
      moment(endDate).format(yearFormat)
    )
  )

  if (err) {
    console.error('databaseError', err)

    return Promise.reject(new Error(messages.PROPERTY_AVAILABLE_DATES_CANNOT_BE_FETCHED))
  }

  if (result.count !== '0') {
    return Promise.reject(new Error(messages.PROPERTY_NOT_AVAILABLE_FOR_DATES))
  }

  return true
}

module.exports = {
  validate,
  isPropertyExisting,
  isEndDateLaterThanStartDate,
  isBookingPeriodAvailable,
  isFutureDate
}
