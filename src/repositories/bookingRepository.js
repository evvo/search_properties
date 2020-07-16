'use strict'

const db = require('../db')
const { v4 } = require('uuid')

class BookingRepository {
  static async getBookingsByPropertyId (propertyId) {
    return db
      .select()
      .table('bookings')
      .where('property_id', propertyId)
  }

  static async saveBooking (data) {
    const newUuid = v4()
    await db
      .table('bookings')
      .insert({ ...data, id: newUuid })

    return newUuid
  }

  static async getBookingById (bookingId) {
    return db
      .select()
      .table('bookings')
      .where('id', bookingId)
      .first()
  }

  static async getBookingsCountForPropertyAndPeriod (propertyId, startDate, endDate) {
    return db
      .table('bookings')
      .count('id')
      .where('start_date', '<=', endDate)
      .andWhere('end_date', '>=', startDate)
      .first()
  }
}

module.exports = BookingRepository
