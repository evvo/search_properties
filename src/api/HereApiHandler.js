const { BaseApiHandler } = require('./BaseApiHandler')
const axios = require('axios')
const { to } = require('await-to-js')

class HereApiHandler extends BaseApiHandler {
  static async fetchRawProperty(propertyId) {
    const params = HereApiHandler.buildParams({})
    const propertyContextId = ';context=Zmxvdy1pZD1kN2FjODdiYi04MTVkLTU0MWYtYWZmOS1mOGFlODI1ODkwNGJfMTU5NDg2NDk3NDA1M183MjE1XzkwNiZyYW5rPTE5'

    return axios.get(`https://places.ls.hereapi.com/places/v1/places/${propertyId + propertyContextId}?` + params)
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

    return response.data.results.items.map(result => ({
      id: result.id,
      name: result.title,
      position: result.position,
      distance: result.distance
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
