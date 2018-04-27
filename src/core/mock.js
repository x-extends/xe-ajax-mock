'use strict'

var utils = require('./util')
var fetchExports = require('../adapters/fetch')
var xhrExports = require('../adapters/xhr')
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
  defineMocks(utils.isArray(path) ? (options = method, path) : [{path: path, method: method, response: response}], opts, opts.baseURL, true)
  return XEAjaxMock
}

XEAjaxMock.version = '1.6.12-beta.0'

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
          item.path = item.path
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
    if (this.options.error && (response.status < 200 || response.status >= 300)) {
      console.error(request.method + ' ' + url + ' ' + response.status)
    }
    if (this.options.log) {
      console.info('[XEAjaxMock] URL: ' + url + '\nMethod: ' + request.method + ' => Status: ' + (response ? response.status : 'canceled') + ' => Time: ' + this.time + 'ms')
      console.info(response)
    }
  }
})

module.exports = XEAjaxMock
