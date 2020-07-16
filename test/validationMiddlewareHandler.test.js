'use strict'

jest.mock('knex')
const spyConsoleError = jest.spyOn(console, 'error').mockImplementation()

const { UNPROCESSABLE_ENTITY } = require('http-status-codes')
const { validate } = require('../src/validation/validationHelpers')
const { param, body, query } = require('express-validator')

describe('validatorMiddleware', () => {
  test('Validator creates the proper middleware', async () => {
    const simpleValidator = [
      body('bodyParam1').isFloat(),
      body('bodyParam2').isFloat()
    ]

    const validatorMiddleware = validate(simpleValidator)

    const mockRequest = {
      body: {
        bodyParam1: 'bla-bla'
      }
    }

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    }
    const mockNext = jest.fn()

    await validatorMiddleware(mockRequest, mockResponse, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(UNPROCESSABLE_ENTITY)
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: true,
      data: {
        errors: [
          {
            value: 'bla-bla',
            msg: 'Invalid value',
            param: 'bodyParam1',
            location: 'body'
          },
          {
            msg: 'Invalid value',
            param: 'bodyParam2',
            location: 'body'
          }
        ]
      }
    })
    expect(spyConsoleError).toHaveBeenCalled()
  })

  test('Validator validates query params', async () => {
    const simpleValidator = [
      query('LAT').isFloat(),
      query('LONG').isFloat()
    ]

    const validatorMiddleware = validate(simpleValidator)

    const mockRequest = {
      query: {
        LAT: 'bla-bla'
      }
    }

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    }
    const mockNext = jest.fn()

    await validatorMiddleware(mockRequest, mockResponse, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(UNPROCESSABLE_ENTITY)
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: true,
      data: {
        errors: [
          {
            value: 'bla-bla',
            msg: 'Invalid value',
            param: 'LAT',
            location: 'query'
          },
          {
            msg: 'Invalid value',
            param: 'LONG',
            location: 'query'
          }
        ]
      }
    })
    expect(spyConsoleError).toHaveBeenCalled()
  })

  test('Validator validates url params', async () => {
    const simpleValidator = [
      param('urlParam1').isFloat(),
      param('urlParam2').isFloat()
    ]

    const validatorMiddleware = validate(simpleValidator)

    const mockRequest = {
      params: {
        urlParam1: 'bla-bla'
      }
    }

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    }
    const mockNext = jest.fn()

    await validatorMiddleware(mockRequest, mockResponse, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(UNPROCESSABLE_ENTITY)
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: true,
      data: {
        errors: [
          {
            value: 'bla-bla',
            msg: 'Invalid value',
            param: 'urlParam1',
            location: 'params'
          },
          {
            msg: 'Invalid value',
            param: 'urlParam2',
            location: 'params'
          }
        ]
      }
    })
    expect(spyConsoleError).toHaveBeenCalled()
  })

  test('Valid results allows chain to continue to the request handler', async () => {
    const simpleValidator = [
      query('LAT').isFloat(),
      query('LONG').isFloat()
    ]

    const validatorMiddleware = validate(simpleValidator)

    const mockRequest = {
      query: {
        LAT: 1.11,
        LONG: 1.11
      }
    }

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    }

    const mockNext = jest.fn()
    await validatorMiddleware(mockRequest, mockResponse, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalledWith(UNPROCESSABLE_ENTITY)
    expect(mockResponse.send).not.toHaveBeenCalled()
    expect(spyConsoleError).not.toHaveBeenCalled()
  })
})
