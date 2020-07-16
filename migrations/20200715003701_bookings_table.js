
exports.up = function(knex) {
  return knex.schema.createTable('bookings', function(table) {
    table.uuid('id').primary().notNullable()
    table.string('username').notNullable()
    table.string('property_id').notNullable()
    table.timestamp('start_date').notNullable()
    table.timestamp('end_date').notNullable()

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.unique(['property_id', 'start_date', 'end_date'], 'property_booking_time_range')
    table.index(['property_id'], 'booking_by_property')
  })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable("bookings")
}

exports.config = {
  transaction: process.env.DB_MIGRATIONS_TRANSACTIONS
}
