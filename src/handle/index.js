
'use strict'

var utils = require('../core/utils')
var mockStore = require('../core/store')
var XEMockResponse = require('./response')
var MockResult = require('./result')

function XHR (url, request, response, matchRest) {
  var statusText = response.statusText
  this.Headers = {
    General: {
      'Request URL': url,
      'Request Method': request.method,
      'Status Code': response.status + (statusText ? ' ' + statusText : '')
    },
    'Response Headers': utils.getHeaderObjs(response.headers),
    'Request Headers': utils.getHeaderObjs(request.headers)
  }
  if (request.body) {
    this.Headers[request.bodyType === 'json-data' ? 'Request Payload' : 'Form Data'] = request.body
  }
  if (request.params === '') {
    this.Headers['Query String Parameters'] = request.params
  }
  this.Response = response.body
  this.Timing = {
    Waiting: matchRest.waiting + ' ms'
  }
}

function parsePathVariable (val, mockItem) {
  if (val && mockItem.options.pathVariable === 'auto') {
    if (!isNaN(val)) {
      return parseFloat(val)
    } else if (val === 'true') {
      return true
    } else if (val === 'false') {
      return false
    }
  }
  return val
}

var handleExports = {
  outMockLog: function (request, response, matchRest) {
    var url = request.getUrl()
    var options = matchRest.context.options
    var method = request.method
    var isError = response.status < 200 || response.status >= 300
    if (isError && options.error) {
      console.error(['[Mock]', method, url, response.status].join(' '))
    }
    if (isError || options.log) {
      console.log(['[Mock]', isError ? 'failed' : 'finished', 'loading:', method, url].join(' '))
      console.info(new XHR(url, request, response, matchRest))
    }
  },
  getMockResponse: function (request, matchRest) {
    var mockItem = matchRest.context
    return new Promise(function (resolve, reject) {
      matchRest._waitingTimeout = setTimeout(function () {
        if (!request.$complete) {
          if (utils.isFunction(mockItem.response)) {
            return Promise.resolve(mockItem.response(request, new XEMockResponse(matchRest, request, null, 200), matchRest)).then(function (response) {
              resolve(new XEMockResponse(matchRest, request, response, 200))
            })
          }
          return Promise.resolve(mockItem.response).then(function (response) {
            resolve(new XEMockResponse(matchRest, request, response, 200))
          }).catch(function (response) {
            reject(new XEMockResponse(matchRest, request, response, 500))
          })
        }
      }, matchRest.waiting)
    })
  },
  mateMockItem: function (request) {
    var mockItem
    var pathParams
    var matchs
    var pathVariable = {}
    var url = (request.getUrl() || '').split(/\?|#/)[0]
    var index = 0
    var len = mockStore.length
    for (; index < len; index++) {
      mockItem = mockStore[index]
      if ((mockItem.jsonp ? (mockItem.jsonp === request.jsonp) : true) && request.method.toLowerCase() === mockItem.method.toLowerCase()) {
        pathParams = []
        matchs = url.match(new RegExp(mockItem.path.replace(/{[^{}]+}/g, function (name) {
          pathParams.push(name.substring(1, name.length - 1))
          return '([^/]+)'
        }).replace(/\/[*]{2}/g, '/.+').replace(/\/[*]{1}/g, '/[^/]+') + '/?$'))
        if (matchs && matchs.length === pathParams.length + 1) {
          if (mockItem.options.pathVariable && pathParams.length) {
            utils.arrayEach(pathParams, function (key, index) {
              pathVariable[key] = parsePathVariable(matchs[index + 1], mockItem)
            })
          }
          return new MockResult(request, mockItem, pathVariable)
        }
      }
    }
  }
}

module.exports = handleExports
