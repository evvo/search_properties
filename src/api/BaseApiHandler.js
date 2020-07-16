class BaseApiHandler {
  static config (appId, appKey) {
    BaseApiHandler.appId = appId
    BaseApiHandler.appKey = appKey
  }

  static buildParams(params) {
    return new URLSearchParams({
      ...params,
      app_id: BaseApiHandler.appId,
      app_code: BaseApiHandler.appKey
    })
  }

  // Abstract
  static async getPropertiesByCoordinates(lat, lng) {
    throw new Error('Implementation required')
  }

  // Abstract
  static async getPropertyInformation(propertyId) {
    throw new Error('Implementation required')
  }
}

module.exports = {
  BaseApiHandler
}
