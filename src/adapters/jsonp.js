'use strict'

var handleExports = require('../handle')

var $global = typeof window === 'undefined' ? this : window

function jsonpClear (request) {
  if (request.script.parentNode === document.body) {
    document.body.removeChild(request.script)
  }
  try {
    delete $global[request.jsonpCallback]
  } catch (e) {
    // IE8
    $global[request.jsonpCallback] = undefined
  }
}

function jsonpSuccess (request, response, resolve) {
  jsonpClear(request)
  resolve(response)
}

function jsonpError (request, reject) {
  jsonpClear(request)
  reject(new TypeError('JSONP request failed'))
}

/**
 * jsonp
 */
function sendJsonp (script, request) {
  return new Promise(function (resolve, reject) {
    var url
    var matchRest = handleExports.mateMockItem(request)
    $global[request.jsonpCallback] = function (body) {
      jsonpSuccess(request, { status: 200, body: body }, resolve)
    }
    if (matchRest) {
      return handleExports.getMockResponse(request, matchRest).then(function (response) {
        if (response.status < 200 || response.status >= 300) {
          jsonpError(request, reject)
        } else {
          jsonpSuccess(request, response.body, resolve)
        }
        handleExports.outMockLog(request, response, matchRest)
      })
    } else {
      url = request.getUrl()
      script.type = 'text/javascript'
      script.src = url + (url.indexOf('?') === -1 ? '?' : '&') + request.jsonp + '=' + request.jsonpCallback
      script.onerror = function () {
        jsonpError(request, reject)
      }
      if (request.timeout) {
        setTimeout(function () {
          jsonpError(request, reject)
        }, request.timeout)
      }
      document.body.appendChild(script)
    }
  })
}

var jsonpExports = {
  sendJsonp: sendJsonp
}

module.exports = jsonpExports
