'use strict'

var utils = require('../core/utils')
var handleExports = require('../handle')

function sendFetch (url, options) {
  var request = options._request
  var mockItem = handleExports.mateMockItem(request)
  if (mockItem) {
    mockItem.time = utils.getScopeNumber(mockItem.options.timeout)
    return mockItem.getMockResponse(request).then(function (response) {
      mockItem.outMockLog(request, response)
      return response
    })
  } else {
    return self.fetch(url, options)
  }
}

var fetchExports = {
  sendJsonp: sendFetch
}

module.exports = fetchExports
