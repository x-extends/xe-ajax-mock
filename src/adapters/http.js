'use strict'

var handleExports = require('../handle')

function sendHttp (request, next, finish, failed) {
  var matchRest = handleExports.mateMockItem(request)
  if (matchRest) {
    return handleExports.getMockResponse(request, matchRest).then(function (response) {
      handleExports.outMockLog(request, response, matchRest)
      finish(response)
    })
  } else {
    next()
  }
}

var httpExports = {
  sendHttp: sendHttp
}

module.exports = httpExports
