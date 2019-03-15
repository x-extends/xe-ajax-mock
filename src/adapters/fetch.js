'use strict'

var handleExports = require('../handle')

function sendFetch (url, options) {
  var request = options._request
  var matchRest = handleExports.mateMockItem(request)
  if (matchRest) {
    return handleExports.getMockResponse(request, matchRest).then(function (response) {
      handleExports.outMockLog(request, response, matchRest)
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
