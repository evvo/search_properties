'use strict'

const messages = {
  PROPERTY_STATUS_UNAVAILABLE: 'Property status unavailable. Please try again later',
  PROPERTY_NOT_FOUND: 'Property not found',
  PROPERTY_AVAILABLE_DATES_CANNOT_BE_FETCHED: 'Property availability dates cannot be fetched. Please Try again later',
  PROPERTY_NOT_AVAILABLE_FOR_DATES: 'Property is not available for these dates',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  API_ERROR: 'Internal Server Error',
  URL_NOT_FOUND: 'Not found',
  DATABASE_ERROR: 'Internal Server Error'
}

const yearFormat = 'YYYY-MM-DD'

module.exports = {
  messages,
  yearFormat
}
