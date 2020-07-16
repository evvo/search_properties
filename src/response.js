'use strict'

const HttpStatus = require('http-status-codes')
const { messages } = require('./constants')

class Response {
  static successData (data = null) {
    return {
      success: true,
      data
    }
  }

  static errorData (data = null) {
    return {
      error: true,
      data
    }
  }

  static async success(res, data) {
    res
      .status(HttpStatus.OK)
      .send(Response.successData(data))
  }

  static async error(res, data, status = HttpStatus.INTERNAL_SERVER_ERROR) {
    res
      .status(status)
      .send(Response.errorData(data))
  }

  static async errorHandler (err, req, res) {
    return Response.serverError(res, err)
  }

  static async created(res, data) {
    res
      .status(HttpStatus.CREATED)
      .send(Response.successData(data))
  }

  static async serverError(res, err) {
    console.error('serverError', err)

    return Response.error(res, messages.INTERNAL_SERVER_ERROR)
  }

  static async apiError(res, err) {
    console.error('apiError', err)

    return Response.error(res, messages.API_ERROR)
  }

  static async validationError(res, err) {
    console.error('vaidationError', err)

    return Response.error(res, err, HttpStatus.UNPROCESSABLE_ENTITY)
  }

  static async notFoundError(res, err) {
    console.error('notFoundError', err)

    return Response.error(res, { message: messages.URL_NOT_FOUND }, HttpStatus.NOT_FOUND)
  }

  static async databaseError(res, err) {
    console.error('databaseError', err)

    return Response.error(res, messages.DATABASE_ERROR)
  }
}

module.exports = Response
