'use strict'

jest.mock('knex')

const awilix = require('awilix')
const container = require('../src/diContainer')
const bookingRepository = {}
container.register('bookingRepository', awilix.asValue(bookingRepository))
const { isBookingPeriodAvailable } = require('../src/validation/validationHelpers')

describe('isBookingAvailableValidator', () => {
  test('If no booking is registered, it is available for booking', async () => {
    bookingRepository.getBookingsCountForPropertyAndPeriod = jest.fn(() => Promise.resolve({
      count: '0'
    }))
    const mockRequest = {
      body: {
        propertyId: 'test',
        startDate: '2020-10-10',
        endDate: '2020-10-10'
      }
    }

    await expect(isBookingPeriodAvailable('2020-10-10', { req: mockRequest }))
      .resolves
      .toBeTruthy()
  })

  test('If there is existing booking it is NOT available for booking', async () => {
    bookingRepository.getBookingsCountForPropertyAndPeriod = jest.fn(() => Promise.resolve({
      count: '1'
    }))

    const mockRequest = {
      body: {
        propertyId: 'test',
        startDate: '2020-10-10',
        endDate: '2020-10-10'
      }
    }

    await expect(isBookingPeriodAvailable('2020-10-10', { req: mockRequest }))
      .rejects
      .toEqual(new Error('Property is not available for these dates'))
  })
})
