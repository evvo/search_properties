'use strict'

require('dotenv').config()

const { to } = require('await-to-js')
const express = require('express')
const container = require('./diContainer')
const apiHandler = container.resolve('apiHandler')
const bookingRepository = container.resolve('bookingRepository')
const humps = require('humps')
const { validate } = require('./validation/validationHelpers')
const Response = require('./response')
const cors = require('cors')
const {
  propertyValidator,
  getPropertyBookingsValidator,
  createBookingValidator,
  getPropertiesValidator
} = require('./validation/validators')

const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const url = require('url')
const swaggerDocument = YAML.load('./swagger.yaml')

const app = express()
const port = process.env.API_PORT || 3000
const apiPath = process.env.API_PATH

app.use(express.json())
app.use(cors())
app.options('*', cors())
app.disable('x-powered-by')

const swaggerOptions = {
  explorer: true
}

app.use('/api-docs', function(req, res, next) {
  req.swaggerDoc = {
    ...swaggerDocument,
    servers: [
      {
        url: url.format({
          protocol: req.protocol,
          host: req.get('host'),
          pathname: apiPath
        })
      }
    ]
  }

  next()
}, swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions))

app.get(`${apiPath}/properties`, validate(getPropertiesValidator), async (req, res) => {
  const { LAT, LONG } = req.query
  const [err, properties] = await to(apiHandler.getPropertiesByCoordinates(LAT, LONG))

  if (err) {
    return Response.apiError(res, err)
  }

  return Response.success(res, properties)
})

// Property validator is separated, as we don't want to check available dates for non-existing property
app.post(`${apiPath}/bookings`, validate(propertyValidator), validate(createBookingValidator), async (req, res) => {
  let err, recordId, result

  [err, recordId] = await to(bookingRepository.saveBooking(humps.decamelizeKeys(req.body)))

  if (err) {
    return Response.databaseError(res, err)
  }

  [err, result] = await to(bookingRepository.getBookingById(recordId))

  if (err) {
    return Response.databaseError(res, err)
  }

  return Response.created(res, humps.camelizeKeys(result))
})

app.get(`${apiPath}/properties/:propertyId/bookings`, validate(getPropertyBookingsValidator), async (req, res) => {
  const [err, bookings] = await to(bookingRepository.getBookingsByPropertyId(req.param('propertyId')))

  if (err) {
    return Response.databaseError(res, err)
  }

  return Response.success(res, bookings)
})

// Error 404
app.all('*',
  (req, res) => {
    return Response.notFoundError(res, { path: req.path, method: req.method })
  })

app.enable('trust proxy')
app.use(Response.errorHandler)
app.listen(port, () => console.log(`Properties app listening at http://localhost:${port}`))
