const { BaseApiHandler } = require('./BaseApiHandler')
const axios = require('axios')
const { to } = require('await-to-js')
const compose = require('compose-function')
const async = require('async')

class HereApiHandler extends BaseApiHandler {
  static async fetchRawProperty(propertyId) {
    const params = HereApiHandler.buildParams({})
    // Context parameter is not used, but required by the API
    const propertyContextId = ';context=no'

    return axios.get(`https://places.ls.hereapi.com/places/v1/places/${propertyId + propertyContextId}?` + params)
  }

  static async decorateAdditionalData(items) {
    await async.mapLimit(items, 20, async (item) => {
      try {
        const result = await HereApiHandler.fetchRawProperty(item.id)
        item.additionalData = result.data
      } catch (e) {}

      return item
    })
  }

  static async getPropertiesByCoordinates(lat, lng) {
    const params = HereApiHandler.buildParams({
      at: `${lat},${lng}`,
      cat: 'hotel',
      result_types: 'place'
    })

    const [err, response] = await to(axios.get(
      'https://places.ls.hereapi.com/places/v1/browse?' + params
    ))

    if (err) {
      console.error(err)

      return Promise.reject(new Error('Unable to connect'))
    }

    if (!response.data.results.items) {
      return []
    }

    await HereApiHandler.decorateAdditionalData(response.data.results.items)

    return compose(HereApiHandler.filterUniqueGeoLocations, HereApiHandler.formatItems)(response.data.results.items)
  }

  static filterUniqueGeoLocations(items) {
    const uniqueLatLng = new Set()

    return items.filter((item) => {
      const itemPosition = `${item.position[0]},${item.position[1]}`
      if (uniqueLatLng.has(itemPosition)) {
        return false
      }

      uniqueLatLng.add(itemPosition)
      return true
    })
  }

  static getImageFromResult(result) {
    if (result.additionalData && result.additionalData.media.images.available) {
      return result.additionalData.media.images.items[0].src
    }

    return null
  }

  static formatItems(items) {
    return items.map(result => ({
      id: result.id,
      name: result.title,
      position: result.position,
      distance: result.distance,
      image: HereApiHandler.getImageFromResult(result)
    }))
  }

  static async getPropertyInformation(propertyId) {
    const [err, result] = await to(HereApiHandler.fetchRawProperty(propertyId))

    if (err) {
      console.error(err)
      return Promise.reject(new Error('Unable to connect'))
    }

    return {
      property_id: result.data.placeId,
      name: result.data.name,
      position: result.data.location.position,
      images: result.data.media.images
    }
  }
}

module.exports = HereApiHandler
