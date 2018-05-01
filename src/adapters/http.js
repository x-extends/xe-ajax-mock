'use strict'

var utils = require('../core/utils')
var handleExports = require('../handle')

function sendHttp (request, next, finish, failed) {
  var mockItem = handleExports.mateMockItem(request)
  if (mockItem) {
    mockItem.time = utils.getScopeNumber(mockItem.options.timeout)
    return new Promise(function (resolve) {
      mockItem.getMockResponse(request).then(function (response) {
        mockItem.outMockLog(request, response)
        finish(response)
      })
    })
  } else {
    next()
  }
}

var httpExports = {
  sendHttp: sendHttp
}

module.exports = httpExports
