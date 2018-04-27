'use strict'

var utils = require('./util')
var XEAjaxMock = require('./mock')
var XETemplate = require('../template')

function createDefine (method) {
  return function (url, response, options) {
    return XEAjaxMock(url, method, response, options)
  }
}

function JSONP (url, response, options) {
  return XEAjaxMock(url, 'GET', response, utils.objectAssign({jsonp: 'callback'}, options))
}

var ajaxMockExports = {
  template: XETemplate,
  Mock: XEAjaxMock,
  JSONP: JSONP,
  GET: createDefine('GET'),
  POST: createDefine('POST'),
  PUT: createDefine('PUT'),
  DELETE: createDefine('DELETE'),
  PATCH: createDefine('PATCH'),
  HEAD: createDefine('HEAD')
}

XEAjaxMock.mixin(ajaxMockExports)

module.exports = XEAjaxMock
module.exports.default = XEAjaxMock
