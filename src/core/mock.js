'use strict'

var utils = require('./utils')
var fetchExports = require('../adapters/fetch')
var xhrExports = require('../adapters/xhr')
var httpExports = require('../adapters/http')
var jsonpExports = require('../adapters/jsonp')
var XEMockResponse = require('../handle/response')
var setupDefaults = require('./setup')
var mockStore = require('./store')

/**
  * XEAjaxMock
  *
  * @param { Array/String } path 请求路径
  * @param { String } method 请求方法
  * @param { Object/Function } response 响应处理 (request, response, context), format: {status: 200, statusText: 'OK', body: {}, headers: {}}
  * @param { Object } options 局部参数
  */
function XEAjaxMock (path, method, response, options) {
  var opts = utils.objectAssign({}, setupDefaults, options)
  defineMocks(utils.isArray(path) ? (options = method, path) : [{ path: path, method: method, response: response }], opts, opts.baseURL, true)
  return XEAjaxMock
}

/**
 * setup defaults
 *
 * @param Object options
 */
XEAjaxMock.setup = function (options) {
  utils.objectAssign(setupDefaults, options)
}

/**
 * install
 */
XEAjaxMock.install = function (XEAjax) {
  XEAjax.setup({
    /* CommonJS */$http: httpExports.sendHttp,
    $fetch: fetchExports.sendJsonp,
    $XMLHttpRequest: xhrExports.XEXMLHttpRequest,
    $jsonp: jsonpExports.sendJsonp
  })
}

/**
 * 混合函数
 *
 * @param {Object} methods 扩展
 */
XEAjaxMock.mixin = function (methods) {
  return utils.objectAssign(XEAjaxMock, methods)
}

function defineMocks (list, options, baseURL, first) {
  if (utils.isArray(list)) {
    utils.arrayEach(list, function (item) {
      if (item.path) {
        if (first && item.path.indexOf('/') === 0) {
          item.path = utils.getLocatOrigin() + item.path
        } else if (first && /\w+:\/{2}.*/.test(item.path)) {

        } else {
          item.path = baseURL.replace(/\/$/, '') + '/' + item.path.replace(/^\//, '')
        }
        if (item.response !== undefined) {
          item.method = String(item.method || 'GET')
          mockStore.push(new XEMock(item.path, item.method, item.response, options))
        }
        defineMocks(item.children, options, item.path)
      }
    })
  }
}

function XEMock (path, method, response, options) {
  if (path && method) {
    this.path = path
    this.method = method
    this.time = 0
    this.response = response
    this.options = options
    this.asyncTimeout = null
  } else {
    if (this.options.error) {
      console.error('path and method cannot be empty')
    }
  }
}

function XHR (url, request, response, mockItem) {
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
    Waiting: mockItem.time + ' ms'
  }
}

Object.assign(XEMock.prototype, {
  getMockResponse: function (request) {
    var mockItem = this
    return new Promise(function (resolve, reject) {
      mockItem.asyncTimeout = setTimeout(function () {
        if (!request.$complete) {
          if (utils.isFunction(mockItem.response)) {
            return Promise.resolve(mockItem.response(request, new XEMockResponse(mockItem, request, null, 200), mockItem)).then(function (response) {
              resolve(new XEMockResponse(mockItem, request, response, 200))
            })
          }
          return Promise.resolve(mockItem.response).then(function (response) {
            resolve(new XEMockResponse(mockItem, request, response, 200))
          }).catch(function (response) {
            reject(new XEMockResponse(mockItem, request, response, 500))
          })
        }
      }, mockItem.time)
    })
  },
  outMockLog: function (request, response) {
    var url = request.getUrl()
    var options = this.options
    var method = request.method
    var isError = options.error && (response.status < 200 || response.status >= 300)
    if (isError) {
      console.error(['[XEAjaxMock] ' + method, url, response.status].join(' '))
    }
    if (isError || options.log) {
      console.info(new XHR(url, request, response, this))
    }
  }
})

module.exports = XEAjaxMock
