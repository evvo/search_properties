'use strict'

const {
  isPropertyExisting,
  isBookingPeriodAvailable,
  isFutureDate,
  isEndDateLaterThanStartDate
} = require('./validationHelpers')

const { param, body, query } = require('express-validator')

const getPropertiesValidator = [
  query('LAT')
    .isFloat({ min: -90, max: 90 }),
  query('LONG')
    .isFloat({ min: -180, max: 180 })
]

const propertyValidator = [
  body('propertyId')
    .trim()
    .isString()
    .not().isEmpty()
    .bail()
    .custom(isPropertyExisting)
]

const getPropertyBookingsValidator = [
  param('propertyId')
    .isString()
    // Should we validate the property id when fetching from the database ?
    // This will add one more API request, but will prevent queries to non-existant properties
    // .custom(isPropertyExisting)
]

const createBookingValidator = [
  body('username')
    .trim()
    .isString()
    .not().isEmpty(),

  body(['startDate', 'endDate'])
    .isDate('YYYY-MM-DD')
    .bail()
    .custom(isFutureDate).withMessage('Dates must be in the future')
    .custom(isEndDateLaterThanStartDate).withMessage('End Date must be later than or equal to the Start Date')
    .bail()
    .custom(isBookingPeriodAvailable).withMessage('Property is not available for these dates2')
]

module.exports = {
  getPropertyBookingsValidator,
  propertyValidator,
  getPropertiesValidator,
  createBookingValidator
}
