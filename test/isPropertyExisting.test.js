'use strict'

jest.mock('knex')
const spyConsoleError = jest.spyOn(console, 'error').mockImplementation()
const awilix = require('awilix')
const apiHandler = {}
const container = require('../src/diContainer')
container.register({ apiHandler: awilix.asValue(apiHandler) })
const { isPropertyExisting } = require('../src/validation/validationHelpers')

describe('isPropertyExisting', () => {
  test('If property can be fetched, return true', async () => {
    apiHandler.fetchRawProperty = jest.fn(() => Promise.resolve({
      response: {
        status: 200
      }
    }))
    const { isPropertyExisting } = require('../src/validation/validationHelpers')

    await expect(isPropertyExisting('test-property-id'))
      .resolves
      .toBeTruthy()

    expect(spyConsoleError).not.toHaveBeenCalled()
  })

  test('If property cannot be fetched, return an error', async () => {
    apiHandler.fetchRawProperty = jest.fn(() => Promise.reject({
      response: {
        status: 500
      }
    }))
    const { isPropertyExisting } = require('../src/validation/validationHelpers')

    await expect(isPropertyExisting('test-property-id'))
      .rejects
      .toEqual(new Error('Property status unavailable. Please try again later'))

    expect(spyConsoleError).toHaveBeenCalled()
  })

  test('If property does not exists, return not found error', async () => {
    apiHandler.fetchRawProperty = jest.fn(() => Promise.reject({
      response: {
        status: 404
      }
    }))

    await expect(isPropertyExisting('test-property-id'))
      .rejects
      .toEqual(new Error('Property not found'))

    // 404 is a normal result, as the property is just not available
    expect(spyConsoleError).not.toHaveBeenCalled()
  })
})
