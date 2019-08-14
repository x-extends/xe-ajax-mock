'use strict'

var utils = require('./utils')
var fetchExports = require('../adapters/fetch')
var xhrExports = require('../adapters/xhr')
var httpExports = require('../adapters/http')
var jsonpExports = require('../adapters/jsonp')
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
  defineMocks(utils.isArray(path) ? path : [{ path: path, method: method, response: response }], opts, opts.baseURL, true)
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
        } else if (first && !/\w+:\/{2}.*/.test(item.path)) {
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
    this.response = response
    this.options = options
  } else {
    if (this.options.error) {
      console.error('path and method cannot be empty')
    }
  }
}

module.exports = XEAjaxMock
