'use strict'

var utils = require('../core/util')

function sendFetch (url, options) {
  var request = options._request
  var mockItem = utils.mateMockItem(request)
  if (mockItem) {
    mockItem.time = utils.getScopeNumber(mockItem.options.timeout)
    return mockItem.getMockResponse(request).then(function (response) {
      mockItem.outMockLog(request, response)
      return response
    })
  } else {
    return fetch(url, options)
  }
}

var fetchExports = {
  sendJsonp: sendFetch
}

module.exports = fetchExports
